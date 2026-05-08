from pydantic import BaseModel, Field
from typing import List, Optional, Any
from bson import ObjectId
from pydantic_core import core_schema
from pydantic import GetCoreSchemaHandler

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, _source_type: Any, _handler: GetCoreSchemaHandler
    ) -> core_schema.CoreSchema:
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema([
                    core_schema.str_schema(),
                    core_schema.no_info_plain_validator_function(lambda x: ObjectId(x)),
                ])
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x)
            ),
        )

class MarketItem(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    itemname: str
    itemprice: str
    itempic: str = ""

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True
    }

class MarketBase(BaseModel):
    marketName: str
    marketAddress: str
    marketPhone: str
    marketOwner: str
    userId: PyObjectId
    location: dict = {"type": "Point", "coordinates": [0.0, 0.0]}
    items: List[MarketItem] = []

class MarketCreate(MarketBase):
    pass

class MarketResponse(MarketBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True
    }
