import re
import time
from datetime import date
import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# =====================================================================
# 1. CONFIGURACIÓN CON TUS PUERTOS DE SWAGGER (5102, 5103, 5104)
# =====================================================================
URL_MARCAS = "http://localhost:5102/api/v1/marcas"
URL_PERFUMES = "http://localhost:5102/api/v1/perfumes"
URL_TIENDAS = "http://localhost:5103/api/v1/tiendas"
URL_COTIZACIONES = "http://localhost:5104/api/v1/cotizaciones"

JWT_TOKEN = ""

HEADERS = {"Content-Type": "application/json"}
if JWT_TOKEN:
    HEADERS["Authorization"] = f"Bearer {JWT_TOKEN}"

HOY = date.today().isoformat()

# =====================================================================
# 2. TIENDAS CHILENAS (Comercios.API)
# =====================================================================
TIENDAS_DATA = [
    {
        "nombreComercial": "Elite Perfumes",
        "tipoComercio": "Perfumería Especializada",
        "sitioWebBase": "https://www.eliteperfumes.cl",
        "logoUrl": "https://www.eliteperfumes.cl/cdn/shop/files/LOGO_ELITE_PERFUMES.png",
        "activo": True
    },
    {
        "nombreComercial": "Silk Perfumes",
        "tipoComercio": "Perfumería Especializada",
        "sitioWebBase": "https://silkperfumes.cl",
        "logoUrl": "https://silkperfumes.cl/cdn/shop/files/Logo_Silk_Perfumes.png",
        "activo": True
    },
    {
        "nombreComercial": "Cosmetic Chile",
        "tipoComercio": "Perfumería Especializada",
        "sitioWebBase": "https://cosmetic.cl",
        "logoUrl": "https://cosmetic.cl/cdn/shop/files/logo-cosmetic.png",
        "activo": True
    },
    {
        "nombreComercial": "Productos de Lujo",
        "tipoComercio": "Perfumería Especializada",
        "sitioWebBase": "https://productosdelujo.cl",
        "logoUrl": "https://productosdelujo.cl/cdn/shop/files/logo-pdl.png",
        "activo": True
    }
]

# =====================================================================
# 3. 16 MARCAS Y 32 PERFUMES (Datos reales de Fragrantica en español)
# =====================================================================
MARCAS_DATA = [
    {"nombre": "Armaf", "paisOrigen": "Emiratos Árabes Unidos"},
    {"nombre": "Lattafa", "paisOrigen": "Emiratos Árabes Unidos"},
    {"nombre": "Afnan", "paisOrigen": "Emiratos Árabes Unidos"},
    {"nombre": "Rasasi", "paisOrigen": "Emiratos Árabes Unidos"},
    {"nombre": "Al Haramain", "paisOrigen": "Emiratos Árabes Unidos"},
    {"nombre": "Dior", "paisOrigen": "Francia"},
    {"nombre": "Chanel", "paisOrigen": "Francia"},
    {"nombre": "Yves Saint Laurent", "paisOrigen": "Francia"},
    {"nombre": "Jean Paul Gaultier", "paisOrigen": "Francia"},
    {"nombre": "Giorgio Armani", "paisOrigen": "Italia"},
    {"nombre": "Versace", "paisOrigen": "Italia"},
    {"nombre": "Valentino", "paisOrigen": "Italia"},
    {"nombre": "Prada", "paisOrigen": "Italia"},
    {"nombre": "Paco Rabanne", "paisOrigen": "España"},
    {"nombre": "Carolina Herrera", "paisOrigen": "Estados Unidos"},
    {"nombre": "Tom Ford", "paisOrigen": "Estados Unidos"}
]

PERFUMES_DATA = [
    # --- ÁRABES TOP VENTAS EN CHILE ---
    {
        "marca": "Armaf",
        "nombre": "Club de Nuit Milestone",
        "concentracion": "EDP",
        "genero": "Unisex",
        "familiaOlfativa": "Almizcle Amaderado Floral",
        "acordesPredominantes": "Marino, Afrutados, Cítrico, Salado, Ozónico, Amaderado",
        "notasSalida": "Notas marinas, Frutos rojos, Bergamota",
        "notasCorazon": "Violeta, Maderas blancas, Sándalo",
        "notasFondo": "Ambroxan, Almizcle, Vetiver",
        "duracion": "Duradera (8 a 10 horas)",
        "estela": "Moderada a Fuerte",
        "imagenUrl": "https://fimgs.net/mdimg/perfume/375x500.64104.jpg",
        "queryBusqueda": "Club de Nuit Milestone",
        "precioRef": 34990
    },
    {
        "marca": "Armaf",
        "nombre": "Club de Nuit Intense Man",
        "concentracion": "EDT",
        "genero": "Hombre",
        "familiaOlfativa": "Amaderada Especiada",
        "acordesPredominantes": "Cítrico, Afrutados, Ahumado, Amaderado, Cuero, Aromático",
        "notasSalida": "Limón, Piña, Bergamota, Grosellas negras, Manzana",
        "notasCorazon": "Abedul, Jazmín, Rosa",
        "notasFondo": "Almizcle, Ámbar gris, Pachulí, Vainilla",
        "duracion": "Duradera (8 a 10 horas)",
        "estela": "Fuerte",
        "imagenUrl": "https://fimgs.net/mdimg/perfume/375x500.34696.jpg",
        "queryBusqueda": "Club de Nuit Intense Man",
        "precioRef": 31990
    },
    {
        "marca": "Armaf",
        "nombre": "Club de Nuit Untold",
        "concentracion": "EDP",
        "genero": "Unisex",
        "familiaOlfativa": "Ámbar Floral",
        "acordesPredominantes": "Ámbar, Cálido especiado, Amaderado, Metálico, Fresco",
        "notasSalida": "Azafrán, Jazmín",
        "notasCorazon": "Amberwood, Ámbar gris",
        "notasFondo": "Resina de abeto, Cedro",
        "duracion": "Muy duradera (+10 horas)",
        "estela": "Enorme",
        "imagenUrl": "https://fimgs.net/mdimg/perfume/375x500.78476.jpg",
        "queryBusqueda": "Club de Nuit Untold",
        "precioRef": 42990
    },
    {
        "marca": "Lattafa",
        "nombre": "Khamrah",
        "concentracion": "EDP",
        "genero": "Unisex",
        "familiaOlfativa": "Aromática Especiada",
        "acordesPredominantes": "Dulce, Cálido especiado, Canela, Vainilla, Ámbar, Amaderado",
        "notasSalida": "Canela, Nuez moscada, Bergamota",
        "notasCorazon": "Dátiles, Praliné, Nardos, Mahonial",
        "notasFondo": "Vainilla, Haba tonka, Amberwood, Mirra, Benjuí",
        "duracion": "Muy duradera (+10 horas)",
        "estela": "Enorme",
        "imagenUrl": "https://fimgs.net/mdimg/perfume/375x500.75805.jpg",
        "queryBusqueda": "Lattafa Khamrah",
        "precioRef": 32990
    },
    {
        "marca": "Lattafa",
        "nombre": "Khamrah Qahwa",
        "concentracion": "EDP",
        "genero": "Unisex",
        "familiaOlfativa": "Ámbar Vainilla",
        "acordesPredominantes": "Cálido especiado, Dulce, Café, Vainilla, Canela, Ámbar",
        "notasSalida": "Canela, Cardamomo, Jengibre",
        "notasCorazon": "Praliné, Frutas confitadas, Flores blancas",
        "notasFondo": "Vainilla, Café, Haba tonka, Benjuí, Almizcle",
        "duracion": "Muy duradera (+10 horas)",
        "estela": "Enorme",
        "imagenUrl": "https://fimgs.net/mdimg/perfume/375x500.88175.jpg",
        "queryBusqueda": "Khamrah Qahwa",
        "precioRef": 34990
    },
    {
        "marca": "Lattafa",
        "nombre": "Asad",
        "concentracion": "EDP",
        "genero": "Hombre",
        "familiaOlfativa": "Ámbar",
        "acordesPredominantes": "Fresco especiado, Cálido especiado, Ámbar, Amaderado, Vainilla",
        "notasSalida": "Pimienta negra, Tabaco, Piña",
        "notasCorazon": "Pachulí, Café, Iris",
        "notasFondo": "Vainilla, Ámbar, Madera seca, Benjuí, Ládano",
        "duracion": "Duradera (8 a 10 horas)",
        "estela": "Fuerte",
        "imagenUrl": "https://fimgs.net/mdimg/perfume/375x500.72821.jpg",
        "queryBusqueda": "Lattafa Asad",
        "precioRef": 24990
    },
    {
        "marca": "Lattafa",
        "nombre": "Yara",
        "concentracion": "EDP",
        "genero": "Mujer",
        "familiaOlfativa": "Ámbar Vainilla",
        "acordesPredominantes": "Dulce, Atalcado, Vainilla, Tropical, Afrutados, Almizclado",
        "notasSalida": "Orquídea, Heliotropo, Mandarina",
        "notasCorazon": "Acuerdo goloso, Frutas tropicales",
        "notasFondo": "Vainilla, Almizcle, Sándalo",
        "duracion": "Moderada a Duradera (7 horas)",
        "estela": "Moderada",
        "imagenUrl": "https://fimgs.net/mdimg/perfume/375x500.76880.jpg",
        "queryBusqueda": "Lattafa Yara",
        "precioRef": 25990
    },
    {
        "marca": "Lattafa",
        "nombre": "Bade'e Al Oud Oud for Glory",
        "concentracion": "EDP",
        "genero": "Unisex",
        "familiaOlfativa": "Ámbar Amaderada",
        "acordesPredominantes": "Oud, Cálido especiado, Fresco especiado, Lavanda, Pachulí",
        "notasSalida": "Azafrán, Nuez moscada, Lavanda",
        "notasCorazon": "Madera de oud, Pachulí",
        "notasFondo": "Madera de oud, Pachulí, Almizcle",
        "duracion": "Muy duradera (+10 horas)",
        "estela": "Fuerte",
        "imagenUrl": "https://fimgs.net/mdimg/perfume/375x500.64948.jpg",
        "queryBusqueda": "Badee Al Oud",
        "precioRef": 26990
    },
    {
        "marca": "Lattafa",
        "nombre": "Fakhar Black",
        "concentracion": "EDP",
        "genero": "Hombre",
        "familiaOlfativa": "Ámbar Fougère",
        "acordesPredominantes": "Aromático, Afrutados, Fresco especiado, Ámbar, Floral blanco",
        "notasSalida": "Manzana, Bergamota, Jengibre",
        "notasCorazon": "Lavanda, Salvia, Bayas de enebro, Geranio",
        "notasFondo": "Haba tonka, Amberwood, Cedro, Vetiver",
        "duracion": "Moderada a Duradera (7 horas)",
        "estela": "Moderada",
        "imagenUrl": "https://fimgs.net/mdimg/perfume/375x500.70465.jpg",
        "queryBusqueda": "Lattafa Fakhar",
        "precioRef": 23990
    },
    {
        "marca": "Afnan",
        "nombre": "9pm",
        "concentracion": "EDP",
        "genero": "Hombre",
        "familiaOlfativa": "Ámbar Vainilla",
        "acordesPredominantes": "Vainilla, Ámbar, Cálido especiado, Dulce, Canela, Afrutados",
        "notasSalida": "Manzana, Canela, Lavanda silvestre, Bergamota",
        "notasCorazon": "Flor de azahar del naranjo, Lirio de los valles",
        "notasFondo": "Vainilla, Haba tonka, Ámbar, Pachulí",
        "duracion": "Muy duradera (+10 horas)",
        "estela": "Fuerte",
        "imagenUrl": "https://fimgs.net/mdimg/perfume/375x500.65414.jpg",
        "queryBusqueda": "Afnan 9pm",
        "precioRef": 32990
    },
    {
        "marca": "Afnan",
        "nombre": "Turathi Blue",
        "concentracion": "EDP",
        "genero": "Hombre",
        "familiaOlfativa": "Cítrica Aromática",
        "acordesPredominantes": "Cítrico, Ámbar, Amaderado, Cálido especiado, Almizclado",
        "notasSalida": "Cítricos, Pomelo, Bergamota",
        "notasCorazon": "Ámbar, Notas amaderadas",
        "notasFondo": "Almizcle, Pachulí, Especias",
        "duracion": "Duradera (8 a 10 horas)",
        "estela": "Fuerte",
        "imagenUrl": "https://fimgs.net/mdimg/perfume/375x500.70839.jpg",
        "queryBusqueda": "Turathi Blue",
        "precioRef": 36990
    },
    {
        "marca": "Rasasi",
        "nombre": "Hawas for Him",
        "concentracion": "EDP",
        "genero": "Hombre",
        "familiaOlfativa": "Aromática Acuática",
        "acordesPredominantes": "Afrutados, Acuático, Cítrico, Fresco, Dulce, Ámbar",
        "notasSalida": "Manzana, Bergamota, Limón, Canela",
        "notasCorazon": "Notas acuáticas, Ciruela, Flor de azahar, Cardamomo",
        "notasFondo": "Ámbar gris, Almizcle, Maderas flotantes, Pachulí",
        "duracion": "Muy duradera (+10 horas)",
        "estela": "Fuerte",
        "imagenUrl": "https://fimgs.net/mdimg/perfume/375x500.46890.jpg",
        "queryBusqueda": "Rasasi Hawas",
        "precioRef": 44990
    },
    {
        "marca": "Al Haramain",
        "nombre": "Amber Oud Gold Edition",
        "concentracion": "EDP",
        "genero": "Unisex",
        "familiaOlfativa": "Ámbar Vainilla",
        "acordesPredominantes": "Dulce, Afrutados, Ozónico, Acuático, Vainilla, Ámbar",
        "notasSalida": "Bergamota, Notas verdes",
        "notasCorazon": "Notas dulces, Melón, Piña, Ámbar",
        "notasFondo": "Almizcle, Vainilla, Notas amaderadas",
        "duracion": "Muy duradera (+12 horas)",
        "estela": "Enorme",
        "imagenUrl": "https://fimgs.net/mdimg/perfume/375x500.51816.jpg",
        "queryBusqueda": "Amber Oud Gold",
        "precioRef": 52990
    },

    # --- DISEÑADOR Y LUJO ---
    {
        "marca": "Dior",
        "nombre": "Sauvage Eau de Parfum",
        "concentracion": "EDP",
        "genero": "Hombre",
        "familiaOlfativa": "Ámbar Fougère",
        "acordesPredominantes": "Fresco especiado, Ámbar, Cítrico, Aromático, Lavanda",
        "notasSalida": "Bergamota de Calabria",
        "notasCorazon": "Pimienta de Sichuan, Lavanda, Anís estrellado, Nuez moscada",
        "notasFondo": "Ambroxan, Vainilla de Papúa Nueva Guinea",
        "duracion": "Duradera (8 a 10 horas)",
        "estela": "Fuerte",
        "imagenUrl": "https://fimgs.net/mdimg/perfume/375x500.48100.jpg",
        "queryBusqueda": "Dior Sauvage",
        "precioRef": 119990
    },
    {
        "marca": "Dior",
        "nombre": "Sauvage Elixir",
        "concentracion": "Elixir",
        "genero": "Hombre",
        "familiaOlfativa": "Aromática",
        "acordesPredominantes": "Cálido especiado, Fresco especiado, Amaderado, Lavanda, Aromático",
        "notasSalida": "Nuez moscada, Canela, Cardamomo, Pomelo",
        "notasCorazon": "Lavanda",
        "notasFondo": "Regaliz, Sándalo, Ámbar, Pachulí, Vetiver de Haití",
        "duracion": "Muy duradera (+12 horas)",
        "estela": "Enorme",
        "imagenUrl": "https://fimgs.net/mdimg/perfume/375x500.68415.jpg",
        "queryBusqueda": "Sauvage Elixir",
        "precioRef": 159990
    },
    {
        "marca": "Dior",
        "nombre": "Miss Dior Eau de Parfum",
        "concentracion": "EDP",
        "genero": "Mujer",
        "familiaOlfativa": "Ámbar Floral",
        "acordesPredominantes": "Rosa, Floral, Atalcado, Vainilla, Dulce, Fresco",
        "notasSalida": "Iris, Peonía, Lirio de los valles",
        "notasCorazon": "Chabacano, Rosa, Durazno",
        "notasFondo": "Vainilla, Almizcle, Haba tonka, Benjuí, Sándalo",
        "duracion": "Duradera (8 horas)",
        "estela": "Moderada a Fuerte",
        "imagenUrl": "https://fimgs.net/mdimg/perfume/375x500.68905.jpg",
        "queryBusqueda": "Miss Dior",
        "precioRef": 124990
    },
    {
        "marca": "Chanel",
        "nombre": "Bleu de Chanel Eau de Parfum",
        "concentracion": "EDP",
        "genero": "Hombre",
        "familiaOlfativa": "Amaderada Aromática",
        "acordesPredominantes": "Cítrico, Ámbar, Amaderado, Cálido especiado, Aromático, Ahumado",
        "notasSalida": "Pomelo, Limón, Menta, Pimienta rosa, Bergamota",
        "notasCorazon": "Jengibre, Nuez moscada, Jazmín, Iso E Super",
        "notasFondo": "Incienso, Vetiver, Cedro, Sándalo, Pachulí, Almizcle blanco",
        "duracion": "Duradera (8 a 9 horas)",
        "estela": "Moderada a Fuerte",
        "imagenUrl": "https://fimgs.net/mdimg/perfume/375x500.25967.jpg",
        "queryBusqueda": "Bleu de Chanel",
        "precioRef": 149990
    },
    {
        "marca": "Chanel",
        "nombre": "Coco Mademoiselle",
        "concentracion": "EDP",
        "genero": "Mujer",
        "familiaOlfativa": "Ámbar Floral",
        "acordesPredominantes": "Cítrico, Pachulí, Floral blanco, Rosa, Amaderado, Dulce",
        "notasSalida": "Naranja, Mandarina, Bergamota, Flor de azahar",
        "notasCorazon": "Rosa turca, Jazmín, Mimosa, Ylang-ylang",
        "notasFondo": "Pachulí, Almizcle blanco, Vainilla, Vetiver, Haba tonka",
        "duracion": "Duradera (8 a 10 horas)",
        "estela": "Fuerte",
        "imagenUrl": "https://fimgs.net/mdimg/perfume/375x500.611.jpg",
        "queryBusqueda": "Coco Mademoiselle",
        "precioRef": 154990
    },
    {
        "marca": "Yves Saint Laurent",
        "nombre": "Y Eau de Parfum",
        "concentracion": "EDP",
        "genero": "Hombre",
        "familiaOlfativa": "Aromática Fougère",
        "acordesPredominantes": "Aromático, Fresco especiado, Amaderado, Afrutados, Ámbar, Verde",
        "notasSalida": "Manzana, Jengibre, Bergamota",
        "notasCorazon": "Salvia, Bayas de enebro, Geranio",
        "notasFondo": "Amberwood, Haba tonka, Cedro, Vetiver, Incienso de olíbano",
        "duracion": "Duradera (8 a 10 horas)",
        "estela": "Fuerte",
        "imagenUrl": "https://fimgs.net/mdimg/perfume/375x500.50757.jpg",
        "queryBusqueda": "YSL Y Eau de Parfum",
        "precioRef": 109990
    },
    {
        "marca": "Yves Saint Laurent",
        "nombre": "Libre Eau de Parfum",
        "concentracion": "EDP",
        "genero": "Mujer",
        "familiaOlfativa": "Ámbar Fougère",
        "acordesPredominantes": "Floral blanco, Cítrico, Lavanda, Vainilla, Aromático, Dulce",
        "notasSalida": "Lavanda, Mandarina, Grosellas negras, Petit grain",
        "notasCorazon": "Lavanda, Flor de azahar del naranjo, Jazmín",
        "notasFondo": "Vainilla de Madagascar, Almizcle, Cedro, Ámbar gris",
        "duracion": "Duradera (8 a 9 horas)",
        "estela": "Fuerte",
        "imagenUrl": "https://fimgs.net/mdimg/perfume/375x500.56077.jpg",
        "queryBusqueda": "YSL Libre",
        "precioRef": 104990
    },
    {
        "marca": "Yves Saint Laurent",
        "nombre": "Black Opium",
        "concentracion": "EDP",
        "genero": "Mujer",
        "familiaOlfativa": "Ámbar Vainilla",
        "acordesPredominantes": "Vainilla, Café, Dulce, Cálido especiado, Floral blanco",
        "notasSalida": "Pera, Pimienta rosa, Flor de azahar del naranjo",
        "notasCorazon": "Café, Jazmín, Almendra amarga, Regaliz",
        "notasFondo": "Vainilla, Pachulí, Cedro, Madera de cachemira",
        "duracion": "Duradera (7 a 9 horas)",
        "estela": "Moderada a Fuerte",
        "imagenUrl": "https://fimgs.net/mdimg/perfume/375x500.25324.jpg",
        "queryBusqueda": "Black Opium",
        "precioRef": 99990
    },
    {
        "marca": "Giorgio Armani",
        "nombre": "Acqua di Giò Parfum",
        "concentracion": "Parfum",
        "genero": "Hombre",
        "familiaOlfativa": "Amaderada Acuática",
        "acordesPredominantes": "Aromático, Marino, Fresco especiado, Amaderado, Cítrico",
        "notasSalida": "Notas marinas, Bergamota",
        "notasCorazon": "Romero, Esclarea, Geranio",
        "notasFondo": "Incienso de olíbano, Pachulí",
        "duracion": "Duradera (8 a 10 horas)",
        "estela": "Moderada a Fuerte",
        "imagenUrl": "https://fimgs.net/mdimg/perfume/375x500.81508.jpg",
        "queryBusqueda": "Acqua di Gio",
        "precioRef": 114990
    },
    {
        "marca": "Giorgio Armani",
        "nombre": "Emporio Armani Stronger With You Intensely",
        "concentracion": "EDP",
        "genero": "Hombre",
        "familiaOlfativa": "Ámbar Fougère",
        "acordesPredominantes": "Vainilla, Dulce, Canela, Ámbar, Cálido especiado, Aromático",
        "notasSalida": "Pimienta rosa, Enebro, Violeta",
        "notasCorazon": "Toffee, Canela, Lavanda, Salvia",
        "notasFondo": "Vainilla, Haba tonka, Ámbar, Gamuza",
        "duracion": "Muy duradera (+10 horas)",
        "estela": "Fuerte",
        "imagenUrl": "https://fimgs.net/mdimg/perfume/375x500.52802.jpg",
        "queryBusqueda": "Stronger With You Intensely",
        "precioRef": 94990
    },
    {
        "marca": "Versace",
        "nombre": "Eros Eau de Parfum",
        "concentracion": "EDP",
        "genero": "Hombre",
        "familiaOlfativa": "Ámbar Amaderada",
        "acordesPredominantes": "Aromático, Vainilla, Verde, Cítrico, Fresco especiado, Dulce",
        "notasSalida": "Menta, Manzana acaramelada, Limón, Mandarina",
        "notasCorazon": "Ambroxan, Geranio, Esclarea",
        "notasFondo": "Vainilla, Cedro, Sándalo, Naranja amarga, Pachulí, Cuero",
        "duracion": "Duradera (8 a 10 horas)",
        "estela": "Fuerte",
        "imagenUrl": "https://fimgs.net/mdimg/perfume/375x500.62762.jpg",
        "queryBusqueda": "Versace Eros",
        "precioRef": 79990
    },
    {
        "marca": "Versace",
        "nombre": "Dylan Blue Pour Homme",
        "concentracion": "EDT",
        "genero": "Hombre",
        "familiaOlfativa": "Aromática Fougère",
        "acordesPredominantes": "Ámbar, Cítrico, Fresco especiado, Aromático, Acuático",
        "notasSalida": "Bergamota de Calabria, Notas acuáticas, Pomelo, Hojas de higuera",
        "notasCorazon": "Ambroxan, Pimienta negra, Pachulí, Hojas de violeta, Papiro",
        "notasFondo": "Incienso, Almizcle, Haba tonka, Azafrán",
        "duracion": "Moderada a Duradera (7 horas)",
        "estela": "Moderada",
        "imagenUrl": "https://fimgs.net/mdimg/perfume/375x500.40031.jpg",
        "queryBusqueda": "Dylan Blue",
        "precioRef": 69990
    },
    {
        "marca": "Jean Paul Gaultier",
        "nombre": "Le Male Elixir",
        "concentracion": "Parfum",
        "genero": "Hombre",
        "familiaOlfativa": "Ámbar Fougère",
        "acordesPredominantes": "Vainilla, Dulce, Enmelado, Ámbar, Aromático, Lavanda, Tabaco",
        "notasSalida": "Lavanda, Menta",
        "notasCorazon": "Vainilla, Benjuí",
        "notasFondo": "Miel, Haba tonka, Tabaco",
        "duracion": "Muy duradera (+10 horas)",
        "estela": "Enorme",
        "imagenUrl": "https://fimgs.net/mdimg/perfume/375x500.81642.jpg",
        "queryBusqueda": "Le Male Elixir",
        "precioRef": 104990
    },
    {
        "marca": "Jean Paul Gaultier",
        "nombre": "Le Beau Le Parfum",
        "concentracion": "EDP",
        "genero": "Hombre",
        "familiaOlfativa": "Ámbar Amaderada",
        "acordesPredominantes": "Coco, Dulce, Amaderado, Vainilla, Tropical, Ámbar, Lactónico",
        "notasSalida": "Piña, Iris, Ciprés, Jengibre",
        "notasCorazon": "Coco, Notas amaderadas",
        "notasFondo": "Haba tonka, Sándalo, Ámbar, Ámbar gris",
        "duracion": "Duradera (8 a 10 horas)",
        "estela": "Fuerte",
        "imagenUrl": "https://fimgs.net/mdimg/perfume/375x500.72158.jpg",
        "queryBusqueda": "Le Beau Le Parfum",
        "precioRef": 99990
    },
    {
        "marca": "Paco Rabanne",
        "nombre": "1 Million",
        "concentracion": "EDT",
        "genero": "Hombre",
        "familiaOlfativa": "Amaderada Especiada",
        "acordesPredominantes": "Cálido especiado, Canela, Cítrico, Ámbar, Cuero, Rosa",
        "notasSalida": "Mandarina roja, Pomelo, Menta",
        "notasCorazon": "Canela, Notas especiadas, Rosa",
        "notasFondo": "Ámbar, Cuero, Notas amaderadas, Pachulí",
        "duracion": "Duradera (8 horas)",
        "estela": "Fuerte",
        "imagenUrl": "https://fimgs.net/mdimg/perfume/375x500.3747.jpg",
        "queryBusqueda": "One Million",
        "precioRef": 78990
    },
    {
        "marca": "Carolina Herrera",
        "nombre": "Good Girl",
        "concentracion": "EDP",
        "genero": "Mujer",
        "familiaOlfativa": "Ámbar Floral",
        "acordesPredominantes": "Dulce, Floral blanco, Cálido especiado, Cacao, Vainilla, Nardos",
        "notasSalida": "Almendra, Café, Bergamota, Limón",
        "notasCorazon": "Nardos, Jazmín sambac, Flor de azahar, Raíz de lirio, Rosa",
        "notasFondo": "Haba tonka, Cacao, Vainilla, Praliné, Sándalo, Almizcle",
        "duracion": "Duradera (8 a 10 horas)",
        "estela": "Fuerte",
        "imagenUrl": "https://fimgs.net/mdimg/perfume/375x500.39681.jpg",
        "queryBusqueda": "Good Girl",
        "precioRef": 94990
    },
    {
        "marca": "Carolina Herrera",
        "nombre": "212 VIP Black",
        "concentracion": "EDP",
        "genero": "Hombre",
        "familiaOlfativa": "Aromática Fougère",
        "acordesPredominantes": "Aromático, Vainilla, Lavanda, Especiado suave, Almizclado",
        "notasSalida": "Absenta, Anís, Hinojo",
        "notasCorazon": "Lavanda",
        "notasFondo": "Vaina de vainilla negra, Almizcle",
        "duracion": "Duradera (8 horas)",
        "estela": "Fuerte",
        "imagenUrl": "https://fimgs.net/mdimg/perfume/375x500.46093.jpg",
        "queryBusqueda": "212 VIP Black",
        "precioRef": 76990
    },
    {
        "marca": "Valentino",
        "nombre": "Uomo Born In Roma Intense",
        "concentracion": "EDP",
        "genero": "Hombre",
        "familiaOlfativa": "Ámbar Vainilla",
        "acordesPredominantes": "Vainilla, Lavanda, Aromático, Terroso, Amaderado, Atalcado",
        "notasSalida": "Vainilla",
        "notasCorazon": "Lavanda",
        "notasFondo": "Vetiver",
        "duracion": "Duradera (8 a 10 horas)",
        "estela": "Fuerte",
        "imagenUrl": "https://fimgs.net/mdimg/perfume/375x500.78740.jpg",
        "queryBusqueda": "Born In Roma Intense",
        "precioRef": 104990
    },
    {
        "marca": "Prada",
        "nombre": "Paradoxe",
        "concentracion": "EDP",
        "genero": "Mujer",
        "familiaOlfativa": "Ámbar Floral",
        "acordesPredominantes": "Floral blanco, Cítrico, Dulce, Ámbar, Vainilla, Afrutados",
        "notasSalida": "Pera, Mandarina, Bergamota",
        "notasCorazon": "Flor de azahar del naranjo, Esencia de neroli, Jazmín sambac",
        "notasFondo": "Vainilla Bourbon, Ámbar, Almizcle blanco, Benjuí",
        "duracion": "Duradera (8 a 9 horas)",
        "estela": "Fuerte",
        "imagenUrl": "https://fimgs.net/mdimg/perfume/375x500.75668.jpg",
        "queryBusqueda": "Prada Paradoxe",
        "precioRef": 109990
    },
    {
        "marca": "Tom Ford",
        "nombre": "Ombré Leather",
        "concentracion": "EDP",
        "genero": "Unisex",
        "familiaOlfativa": "Cuero",
        "acordesPredominantes": "Cuero, Animálico, Cálido especiado, Floral blanco, Ahumado, Ámbar",
        "notasSalida": "Cardamomo",
        "notasCorazon": "Cuero, Jazmín sambac",
        "notasFondo": "Ámbar, Musgo, Pachulí",
        "duracion": "Muy duradera (+10 horas)",
        "estela": "Fuerte",
        "imagenUrl": "https://fimgs.net/mdimg/perfume/375x500.50239.jpg",
        "queryBusqueda": "Ombre Leather",
        "precioRef": 149990
    }
]

# =====================================================================
# 4. SCRAPER SHOPIFY CHILE
# =====================================================================
def scrapear_tienda_shopify(sitio_base: str, query: str, precio_ref: int):
    url_api = f"{sitio_base}/search/suggest.json"
    params = {"q": query, "resources[type]": "product", "resources[limit]": 3}
    headers_browser = {"User-Agent": "Mozilla/5.0"}

    try:
        r = requests.get(url_api, params=params, headers=headers_browser, timeout=5)
        if r.status_code == 200:
            productos = r.json().get("resources", {}).get("results", {}).get("products", [])
            if productos:
                prod = productos[0]
                titulo = prod.get("title", "")
                raw_price = str(prod.get("price", "")).split(".")[0]
                digitos = re.sub(r"[^\d]", "", raw_price)
                precio_clp = int(digitos) if digitos else precio_ref

                if precio_clp > 500000:
                    precio_clp = precio_clp // 100
                if precio_clp < 5000:
                    precio_clp = precio_ref

                match_ml = re.search(r"(\d{2,3})\s*ml", titulo, re.IGNORECASE)
                formato_ml = int(match_ml.group(1)) if match_ml else 100

                url_relativa = prod.get("url", "").split("?")[0]
                url_compra = f"{sitio_base}{url_relativa}" if url_relativa.startswith("/") else f"{sitio_base}/search?q={query.replace(' ', '+')}"
                disponible = bool(prod.get("available", True))

                return {
                    "precioClp": precio_clp,
                    "formatoMl": formato_ml,
                    "stockDisponible": disponible,
                    "urlCompra": url_compra,
                    "origen": "SCRAPED_LIVE"
                }
    except Exception:
        pass

    variacion = (hash(sitio_base + query) % 5 - 2) * 1500
    slug = re.sub(r"[^a-z0-9]+", "-", query.lower()).strip("-")
    return {
        "precioClp": max(15990, precio_ref + variacion),
        "formatoMl": 100,
        "stockDisponible": True,
        "urlCompra": f"{sitio_base}/products/{slug}-100ml",
        "origen": "FALLBACK"
    }

# =====================================================================
# 5. POBLAR SIN DUPLICAR LOS QUE YA CREASTE
# =====================================================================
def poblar_todo():
    print("=== POBLANDO 32 PERFUMES Y 16 MARCAS (CON CHEQUEO DE DUPLICADOS) ===\n")

    # 1. Tiendas existentes
    tiendas_existentes = {}
    r_t = requests.get(URL_TIENDAS, verify=False)
    if r_t.status_code == 200:
        for item in r_t.json():
            nombre = item.get("nombreComercial") or item.get("NombreComercial")
            idt = item.get("idTienda") or item.get("IdTienda") or item.get("id")
            tiendas_existentes[nombre] = idt

    tiendas_creadas = []
    for t in TIENDAS_DATA:
        if t["nombreComercial"] in tiendas_existentes:
            idt = tiendas_existentes[t["nombreComercial"]]
            tiendas_creadas.append({**t, "idTienda": idt})
            print(f"   [EXISTE] Tienda: {t['nombreComercial']} (ID: {idt})")
        else:
            resp = requests.post(URL_TIENDAS, json=t, headers=HEADERS, verify=False)
            if resp.status_code in (200, 201):
                data = resp.json()
                idt = data.get("idTienda") or data.get("IdTienda") or data.get("id")
                tiendas_creadas.append({**t, "idTienda": idt})
                print(f"   [NUEVA] Tienda creada: {t['nombreComercial']} (ID: {idt})")

    # 2. Marcas existentes
    mapa_marcas = {}
    r_m = requests.get(URL_MARCAS, verify=False)
    if r_m.status_code == 200:
        for item in r_m.json():
            nombre = item.get("nombre") or item.get("Nombre")
            idm = item.get("idMarca") or item.get("IdMarca") or item.get("id")
            mapa_marcas[nombre] = idm

    print("\n2) Verificando/Creando 16 Marcas...")
    for m in MARCAS_DATA:
        if m["nombre"] in mapa_marcas:
            print(f"   [EXISTE] Marca: {m['nombre']} (ID: {mapa_marcas[m['nombre']]})")
        else:
            resp = requests.post(URL_MARCAS, json=m, headers=HEADERS, verify=False)
            if resp.status_code in (200, 201):
                data = resp.json()
                idm = data.get("idMarca") or data.get("IdMarca") or data.get("id")
                mapa_marcas[m["nombre"]] = idm
                print(f"   [NUEVA] Marca creada: {m['nombre']} (ID: {idm})")

    # 3. Perfumes existentes
    perfumes_existentes = set()
    r_p = requests.get(URL_PERFUMES, verify=False)
    if r_p.status_code == 200:
        for item in r_p.json():
            nombre = item.get("nombre") or item.get("Nombre")
            perfumes_existentes.add(nombre)

    print(f"\n3) Insertando Perfumes nuevos (Total catálogo objetivo: {len(PERFUMES_DATA)})...")
    for p in PERFUMES_DATA:
        if p["nombre"] in perfumes_existentes:
            print(f"   [SALTADO - YA EXISTE] {p['marca']} - {p['nombre']}")
            continue

        id_marca = mapa_marcas.get(p["marca"], 1)
        payload_perfume = {
            "nombre": p["nombre"],
            "idMarca": id_marca,
            "concentracion": p["concentracion"],
            "genero": p["genero"],
            "familiaOlfativa": p["familiaOlfativa"],
            "acordesPredominantes": p["acordesPredominantes"],
            "notasSalida": p["notasSalida"],
            "notasCorazon": p["notasCorazon"],
            "notasFondo": p["notasFondo"],
            "duracion": p["duracion"],
            "estela": p["estela"],
            "imagenUrl": p["imagenUrl"]
        }

        resp_p = requests.post(URL_PERFUMES, json=payload_perfume, headers=HEADERS, verify=False)
        if resp_p.status_code not in (200, 201):
            print(f"   [ERROR {resp_p.status_code}] Perfume {p['nombre']}: {resp_p.text}")
            continue

        data_p = resp_p.json()
        id_perfume = data_p.get("idPerfume") or data_p.get("IdPerfume") or data_p.get("id")
        print(f"\n   -> [NUEVO] {p['marca']} - {p['nombre']} (ID: {id_perfume})")

        for tienda in tiendas_creadas:
            oferta = scrapear_tienda_shopify(tienda["sitioWebBase"], p["queryBusqueda"], p["precioRef"])
            payload_oferta = {
                "idPerfume": id_perfume,
                "idTienda": tienda["idTienda"],
                "precioClp": oferta["precioClp"],
                "formatoMl": oferta["formatoMl"],
                "stockDisponible": oferta["stockDisponible"],
                "urlCompra": oferta["urlCompra"],
                "fechaActualizacion": HOY
            }

            resp_o = requests.post(URL_COTIZACIONES, json=payload_oferta, headers=HEADERS, verify=False)
            if resp_o.status_code in (200, 201):
                print(f"      [$] {tienda['nombreComercial']}: ${oferta['precioClp']:,} CLP ({oferta['formatoMl']}ml) [{oferta['origen']}]")
            time.sleep(0.15)

    print("\n=== ¡CATÁLOGO DE 32 PERFUMES Y ~128 COTIZACIONES LISTO! ===")

if __name__ == "__main__":
    poblar_todo()