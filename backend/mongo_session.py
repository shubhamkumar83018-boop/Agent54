import operator
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from sqlalchemy.sql.elements import BinaryExpression, UnaryExpression
from . import models

# Map SQLAlchemy binary operators to MongoDB query operators
OPERATOR_MAP = {
    "eq": None,             # Direct equality: {field: val}
    "ne": "$ne",
    "gt": "$gt",
    "ge": "$gte",
    "lt": "$lt",
    "le": "$lte",
    "like": "$regex",
    "ilike": "$regex",
}

class MongoQuery:
    def __init__(self, session, model_class):
        self.session = session
        self.model_class = model_class
        col_name = getattr(model_class, "__tablename__", model_class.__name__.lower())
        self.collection = self.session.db[col_name]
        self.filters: Dict[str, Any] = {}
        self.sort_clauses: List[tuple] = []
        self.limit_val: Optional[int] = None

    def filter(self, *criterion):
        for crit in criterion:
            if isinstance(crit, BinaryExpression):
                field_name = getattr(crit.left, "name", str(crit.left))
                val = getattr(crit.right, "value", crit.right)
                op_name = getattr(crit.operator, "__name__", str(crit.operator))
                mongo_op = OPERATOR_MAP.get(op_name)

                if mongo_op is None:
                    # Equality
                    self.filters[field_name] = val
                else:
                    if field_name not in self.filters or not isinstance(self.filters[field_name], dict):
                        self.filters[field_name] = {}
                    self.filters[field_name][mongo_op] = val
            elif isinstance(crit, dict):
                self.filters.update(crit)
        return self

    def order_by(self, *clauses):
        for clause in clauses:
            if isinstance(clause, UnaryExpression):
                field_name = getattr(clause.element, "name", str(clause.element))
                modifier_str = str(clause.modifier).lower()
                direction = -1 if "desc" in modifier_str else 1
                self.sort_clauses.append((field_name, direction))
            elif isinstance(clause, str):
                if clause.startswith("-"):
                    self.sort_clauses.append((clause[1:], -1))
                else:
                    self.sort_clauses.append((clause, 1))
            elif isinstance(clause, tuple):
                self.sort_clauses.append(clause)
        return self

    def limit(self, limit_count: int):
        self.limit_val = limit_count
        return self

    def count(self) -> int:
        return self.collection.count_documents(self.filters)

    def first(self) -> Optional[Any]:
        sort_arg = self.sort_clauses if self.sort_clauses else None
        doc = self.collection.find_one(self.filters, sort=sort_arg)
        if doc is None:
            return None
        return self._doc_to_model(doc)

    def all(self) -> List[Any]:
        sort_arg = self.sort_clauses if self.sort_clauses else None
        cursor = self.collection.find(self.filters, sort=sort_arg)
        if self.limit_val:
            cursor = cursor.limit(self.limit_val)
        return [self._doc_to_model(doc) for doc in cursor]

    def _doc_to_model(self, doc: dict) -> Any:
        instance = self.model_class()
        for k, v in doc.items():
            if k == "_id":
                continue
            setattr(instance, k, v)
        # Register in session cache
        if hasattr(instance, "id") and instance.id is not None:
            self.session._tracked_instances[instance] = self.collection
        return instance


class MongoSession:
    """SQLAlchemy Session compatible adapter over MongoDB PyMongo database."""
    def __init__(self, mongo_db):
        self.db = mongo_db
        self._pending_adds = []
        self._tracked_instances = {}

    def query(self, model_class) -> MongoQuery:
        return MongoQuery(self, model_class)

    def add(self, instance):
        col_name = getattr(instance, "__tablename__", type(instance).__name__.lower())
        col = self.db[col_name]

        # Auto-assign integer id if not set
        if not getattr(instance, "id", None):
            highest = col.find_one(sort=[("id", -1)])
            next_id = (highest.get("id", 0) + 1) if highest and "id" in highest else (col.count_documents({}) + 1)
            instance.id = next_id

        if instance not in self._pending_adds:
            self._pending_adds.append(instance)
        self._tracked_instances[instance] = col

    def commit(self):
        # Save all pending adds
        for instance in list(self._pending_adds):
            col = self._tracked_instances.get(instance)
            if col is not None:
                doc = self._instance_to_doc(instance)
                col.update_one({"id": doc["id"]}, {"$set": doc}, upsert=True)
        self._pending_adds.clear()

        # Update any modified tracked instances
        for instance, col in list(self._tracked_instances.items()):
            if hasattr(instance, "id") and instance.id is not None:
                doc = self._instance_to_doc(instance)
                col.update_one({"id": doc["id"]}, {"$set": doc}, upsert=True)

    def refresh(self, instance):
        col = self._tracked_instances.get(instance)
        if col is not None and getattr(instance, "id", None) is not None:
            doc = col.find_one({"id": instance.id})
            if doc:
                for k, v in doc.items():
                    if k != "_id":
                        setattr(instance, k, v)

    def delete(self, instance):
        col = self._tracked_instances.get(instance)
        if col is not None and getattr(instance, "id", None) is not None:
            col.delete_one({"id": instance.id})
        if instance in self._pending_adds:
            self._pending_adds.remove(instance)
        if instance in self._tracked_instances:
            del self._tracked_instances[instance]

    def close(self):
        self._pending_adds.clear()
        self._tracked_instances.clear()

    def _instance_to_doc(self, instance) -> dict:
        doc = {}
        for k, v in instance.__dict__.items():
            if k.startswith("_sa_") or k.startswith("_"):
                continue
            doc[k] = v
        return doc
