from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Table, Column, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List
db = SQLAlchemy()

class Persona(db.Model):
    __tablename__ = "persona"
    
    username : Mapped[str] = mapped_column(primary_key=True, nullable=False)
    email : Mapped[str] = mapped_column(primary_key=False, nullable=False)
    password : Mapped[str] = mapped_column(primary_key=False, nullable=False)

    ahorros : Mapped[List["Ahorro"]] = relationship(back_populates="persona") 
    emisiones : Mapped[List["Emisiones"]] = relationship(back_populates="persona")

    def serialize(self):
        return {
            "username" : self.username,
            "email" : self.email,
            "password" : self.password,
           "ahorros": [ahorro.serialize() for ahorro in self.ahorros],
            "emisiones": [emision.serialize() for emision in self.emisiones]
        }


class Ahorro(db.Model):
    __tablename__="ahorro"
    id : Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    username_persona: Mapped[str] = mapped_column(ForeignKey("persona.username"),nullable=False)
    persona: Mapped["Persona"] = relationship(back_populates="ahorros") 
    ingresos : Mapped[float] = mapped_column(primary_key=False, nullable=False)
    gastos : Mapped[float] = mapped_column(primary_key=False, nullable=False)
    fecha : Mapped[str] = mapped_column(primary_key=False, nullable=False)

    def serialize(self):
        return{
            "id" : self.id,
            "persona_id" : self.username_persona,
            "ingresos" : self.ingresos,
            "gastos" : self.gastos,
            "fecha" : self.fecha
        }

class Emisiones(db.Model):
    __tablename__="emisiones"
    id : Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    username_persona: Mapped[str] = mapped_column(ForeignKey("persona.username"),nullable=False)
    persona: Mapped["Persona"] = relationship(back_populates="emisiones") 
    litros_combustible : Mapped[float] = mapped_column(primary_key=False, nullable=False)
    kwh_consumidos : Mapped[float] = mapped_column(primary_key=False, nullable=False)
    tipo_vehiculo : Mapped[str] = mapped_column(primary_key=False, nullable=False)
    energia_renovable : Mapped[Boolean] = mapped_column(primary_key=False, nullable=False)
    tipo_calefaccion : Mapped[str] = mapped_column(primary_key=False, nullable=False)
    fecha : Mapped[str] = mapped_column(primary_key=False, nullable=False)

    def serialize(self):
        return{
            "id" : self.id,
            "persona_id" : self.username_persona,
            "litros_combustible" : self.litros_combustible,
            "kwh_consumidos" : self.kwh_consumidos,
            "tipo_vehiculo" : self.tipo_vehiculo,
            "energia_renovable" : self.energia_renovable,
            "tipo_calefaccion" : self.tipo_calefaccion,
            "fecha" : self.fecha
        }


