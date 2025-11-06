from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Table, Column, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship, validates
from typing import List

db = SQLAlchemy()

class Persona(db.Model):
    __tablename__ = "persona"
    
    username : Mapped[str] = mapped_column(primary_key=True, nullable=False)
    email : Mapped[str] = mapped_column(nullable=False)
    password : Mapped[str] = mapped_column(nullable=False)

  
    ahorros : Mapped[List["Ahorro"]] = relationship(back_populates="persona", cascade="all, delete-orphan") 
    emisiones : Mapped[List["Emisiones"]] = relationship(back_populates="persona", cascade="all, delete-orphan")

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
    
    username_persona: Mapped[str] = mapped_column(ForeignKey("persona.username", ondelete="CASCADE"), nullable=False)
    
    persona: Mapped["Persona"] = relationship(back_populates="ahorros") 
    ingresos : Mapped[float] = mapped_column(nullable=False)
    gastos : Mapped[float] = mapped_column(nullable=False)
    fecha : Mapped[str] = mapped_column(nullable=False)

    def serialize(self):
        return {
            "id" : self.id,
            "persona_id" : self.username_persona,
            "ingresos" : self.ingresos,
            "gastos" : self.gastos,
            "fecha" : self.fecha
        }

class Emisiones(db.Model):
    __tablename__="emisiones"
    
    id : Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    
    username_persona: Mapped[str] = mapped_column(ForeignKey("persona.username", ondelete="CASCADE"), nullable=False)
    
    persona: Mapped["Persona"] = relationship(back_populates="emisiones") 
    litros_combustible : Mapped[float] = mapped_column(nullable=False)
    kwh_consumidos : Mapped[float] = mapped_column(nullable=False)
    tipo_vehiculo : Mapped[str] = mapped_column(nullable=False)
    energia_renovable : Mapped[bool] = mapped_column(nullable=False)
    tipo_calefaccion : Mapped[str] = mapped_column(nullable=False)
    fecha : Mapped[str] = mapped_column(nullable=False)
    kg_co2 : Mapped[float] = mapped_column(nullable=True)
    
    @validates('litros_combustible', 'kwh_consumidos', 'tipo_vehiculo', 'tipo_calefaccion')
    def calcularco2(self, key, value):
        match self.tipo_vehiculo:
            case 'Electrico':
                co2_combustible = 0
            case 'Hibrido':
                co2_combustible = 1500
            case 'Gasolina':
                co2_combustible = 2310
            case 'Diesel':
                co2_combustible = 2680
            case _:
                co2_combustible = 2500
        match self.tipo_calefaccion:
            case 'Electrica':
                co2_electricidad = 200
            case 'Gas-Natural':
                co2_electricidad = 202
            case 'Gas-Propano':
                co2_electricidad = 230
            case 'Gasoil':
                co2_electricidad = 265
            case 'Biomasa':
                co2_electricidad = 0
            case _:
                co2_electricidad = 220
        if self.kwh_consumidos is not None and self.litros_combustible is not None:
            self.kg_co2 = round((self.kwh_consumidos*co2_electricidad*4 + self.litros_combustible * co2_combustible)/1000,2)
        return value
    def serialize(self):
        return {
            "id" : self.id,
            "persona_id" : self.username_persona,
            "litros_combustible" : self.litros_combustible,
            "kwh_consumidos" : self.kwh_consumidos,
            "tipo_vehiculo" : self.tipo_vehiculo,
            "energia_renovable" : self.energia_renovable,
            "tipo_calefaccion" : self.tipo_calefaccion,
            "fecha" : self.fecha,
            "kg_co2" : self.kg_co2 
        }