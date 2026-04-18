export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

export type Module = {
  id: string;
  title: string;
  description: string;
  content: {
    theory: string;
    glossary: { term: string; definition: string }[];
    insuranceExample: string;
    tips: string[];
    commonErrors: string[];
    frameworks: string[];
  };
  quiz: QuizQuestion[];
};

export const modules: Module[] = [
  {
    id: 'm1_fundamentos',
    title: 'Fundamentos de Data Management',
    description: 'Introducción a la gestión de datos como activo estratégico.',
    content: {
      theory: 'El Data Management (Gestión de Datos) es el desarrollo, ejecución y supervisión de planes, políticas, programas y prácticas que entregan, controlan, protegen y mejoran el valor de los datos a lo largo de su ciclo de vida. Tratar el dato como activo real requiere liderazgo, procesos estandarizados y tecnología.',
      glossary: [
        { term: 'Dato vs Información', definition: 'El dato es el hecho crudo; la información es el dato procesado con contexto.' },
        { term: 'Ciclo de Vida del Dato', definition: 'Creación/Captura, Almacenamiento, Uso, Archivo y Destrucción.' }
      ],
      insuranceExample: 'Una aseguradora capta miles de datos de pólizas (edad, historial médico, siniestros). Sin Data Management, un mismo cliente puede existir 5 veces con distintos nombres, impidiendo calcular su riesgo real o venderle pólizas cruzadas (cross-selling).',
      tips: ['Siempre vincula la gestión de datos a un objetivo de negocio (ej. aumentar retención).', 'Habla de "activos" en lugar de "archivos" con la directiva.'],
      commonErrors: ['Creer que es un problema 100% de IT.', 'Ignorar el ciclo de debaja/destrucción de datos.'],
      frameworks: ['DAMA-DMBOK2 (Conceptos base)']
    },
    quiz: [
      { id: 'q1', question: '¿Cuál es el objetivo principal del Data Management?', options: ['Comprar más servidores.', 'Mejorar el valor de los datos a lo largo de su ciclo de vida.', 'Contratar más ingenieros.', 'Auditar el código fuente.'], correctAnswer: 1, explanation: 'Data Management busca extraer el máximo valor y proteger el dato como activo.' },
      { id: 'q2', question: 'El ciclo de vida del dato termina con su archivo permanente.', options: ['Verdadero', 'Falso'], correctAnswer: 1, explanation: 'Falso. Termina con la destrucción (eliminación segura) cuando ya no es necesario.' },
      { id: 'q3', question: '¿Es el Data management una responsabilidad exclusiva de TI?', options: ['Verdadero', 'Falso'], correctAnswer: 1, explanation: 'Falso. El negocio es corresponsable como propietario del dato.' },
      { id: 'q4', question: '¿Qué es DAMA-DMBOK?', options: ['Un motor de base de datos.', 'Un framework de buenas prácticas.', 'Un lenguaje de programación.', 'Una ley.'], correctAnswer: 1, explanation: 'Es la guía técnica y de buenas prácticas más relevante en Data Management.' },
      { id: 'q5', question: 'En un seguro de vida, un dato crudo sería...', options: ['La edad: 45', 'El perfil de riesgo es Alto', 'La rentabilidad del cliente', 'El informe mensual'], correctAnswer: 0, explanation: 'El dato crudo (45) no tiene contexto sin procesamiento.' }
    ]
  },
  {
    id: 'm2_gobierno',
    title: 'Gobierno de Datos',
    description: 'Políticas, roles y control sobre los activos de datos.',
    content: {
      theory: 'El Gobierno de Datos se centra en la autoridad, control y toma de decisiones compartida. Asegura que los datos confíen, se comprendan y se utilicen de manera segura. Involucra establecer Comités de Datos, Data Owners (Propietarios) y métricas de madurez.',
      glossary: [
        { term: 'Data Owner', definition: 'Líder de negocio que tiene autoridad sobre un dominio de datos (ej. Director de Ventas sobre clientes).' },
        { term: 'Data Council', definition: 'Comité que dirime conflictos y aprueba políticas transversales.' }
      ],
      insuranceExample: 'Si Operaciones llama "Siniestro" a un accidente y Legal lo llama "Reclamo", el Gobierno de Datos establece el glosario unívoco y designa quién es responsable de su calidad. Esto evita reportes financieros inflados.',
      tips: ['Empieza de forma iterativa: no gobiernes todo el lago de datos a la vez, elige primero un dominio crítico como "Cliente".'],
      commonErrors: ['Implementar herramientas de dictado de políticas sin cambiar la cultura.', 'Asignar como Data Owner a alguien del equipo de sistemas puro.'],
      frameworks: ['DAMA-DMBOK2 (Data Governance)', 'COBIT (Gobierno de TI)']
    },
    quiz: [
      { id: 'q1', question: '¿Quién debería ser idealmente un Data Owner?', options: ['El Administrador de Base de Datos.', 'Un externo.', 'Un líder o gerente del área de negocio responsable del dominio.', 'Un desarrollador junior.'], correctAnswer: 2, explanation: 'El Data Owner debe ser del lado del negocio, pues conoce el significado y valor del dato.' },
      { id: 'q2', question: 'Gobierno de datos es lo mismo que gestión de bases de datos.', options: ['Verdadero', 'Falso'], correctAnswer: 1, explanation: 'Falso. Gob. de datos trata sobre personas, políticas y roles; gestión de BD es técnica.' },
      { id: 'q3', question: 'Un Comité de Datos (Data Council) sirve para:', options: ['Programar ETLs.', 'Instalar servidores.', 'Tomar acuerdos y aprobar políticas transversales.', 'Ninguna de las anteriores.'], correctAnswer: 2, explanation: 'El comité dirime reglas de negocio y aprueba presupuestos o definiciones.' },
      { id: 'q4', question: '¿Por qué fallan muchas iniciativas de Gobierno?', options: ['Por elegir software barato.', 'Por falta de gestión del cambio organizativo y exceso de burocracia.', 'Por exceso de RAM en servidores.', 'Por usar la nube.'], correctAnswer: 1, explanation: 'Es un cambio cultural. Tratarlo como un proyecto puramente técnico usualmente falla.' },
      { id: 'q5', question: '¿El Glosario de Negocio pertenece al Gobierno de datos?', options: ['Verdadero', 'Falso'], correctAnswer: 0, explanation: 'Verdadero. Establece la terminología común aprobada por el área de Gobierno.' }
    ]
  },
  {
    id: 'm3_arquitectura',
    title: 'Arquitectura de Datos',
    description: 'Diseño estructural de los componentes de datos corporativos.',
    content: {
      theory: 'La arquitectura de datos (AD) define la estructura, integraciones y flujos de datos. Interconecta la estrategia de negocio con la implementación tecnológica. Una buena arquitectura es agnóstica de la tecnología inicial pero se preocupa por la escalabilidad (batch vs streaming, on-premise vs nube).',
      glossary: [
        { term: 'Streaming', definition: 'Proceso de ingesta y análisis continuo casi en tiempo real (ej. Kafka).' },
        { term: 'Batch', definition: 'Procesamiento por lotes (ej. un trabajo diario a las 3 am).' }
      ],
      insuranceExample: 'Para cotizar un seguro de coche en 10 segundos, la arquitectura debe soportar ingesta en streaming (API) conectada a un motor de reglas, en lugar de un proceso batch clásico que bloqueaba la cotización hasta el día siguiente.',
      tips: ['Dibuja diagramas simples (Caja y flecha) para el negocio, y diagramas UML/ER para TI.', 'Piensa siempre en "escalabilidad elástica".'],
      commonErrors: ['Comprar la herramienta antes de definir la arquitectura.', 'Sobredimensionar la arquitectura de streaming cuando el negocio no lo requiere.'],
      frameworks: ['TOGAF', 'Zachman']
    },
    quiz: [
      { id: 'q1', question: 'Una arquitectura orientada a eventos en tiempo real se denomina:', options: ['Batch.', 'Streaming / Event-Driven.', 'Monolítica.', 'Secuencial.'], correctAnswer: 1, explanation: 'Event-Driven o Streaming permite ingesta fluida en tiempo real.' },
      { id: 'q2', question: 'Toda empresa requiere análisis en tiempo real y streaming.', options: ['Verdadero', 'Falso'], correctAnswer: 1, explanation: 'Falso. Depende de las necesidades del negocio. Streaming es costoso.' },
      { id: 'q3', question: 'Frameworks comunes en Arquitectura empresarial y de datos:', options: ['Scrum.', 'TOGAF.', 'React.', 'Laravel.'], correctAnswer: 1, explanation: 'TOGAF es un estándar de arquitectura empresarial, que incluye un bloque de AD.' },
      { id: 'q4', question: 'Un objetivo de la AD es independizar a la empresa del proveedor tecnológico siempre que sea posible.', options: ['Verdadero', 'Falso'], correctAnswer: 0, explanation: 'Verdadero. La AD busca minimizar el "vendor lock-in" a largo plazo y ser agnóstica.' },
      { id: 'q5', question: '¿Entender los flujos de origen a destino (Linaje a nivel sistema) es parte de la Arquitectura?', options: ['Verdadero', 'Falso'], correctAnswer: 0, explanation: 'Verdadero. Mapear flujos es fundamental de la Arquitectura.' }
    ]
  },
  {
    id: 'm4_modelado',
    title: 'Modelado de Datos (Conceptual, Lógico, Físico)',
    description: 'De los conceptos abstractos a las tablas físicas en base de datos.',
    content: {
      theory: 'El modelado traduce requerimientos de negocio a esquemas de bases de datos. Va en 3 niveles: Conceptual (alto nivel, solo entidades como Cliente y Póliza), Lógico (agrega atributos claves, es agnóstico del motor) y Físico (dependiente de tecnología, agrega tipos de datos SQL, índices).',
      glossary: [
        { term: 'Normalización', definition: 'Reglas para reducir la redundancia y mejorar la integridad de datos relacionales.' },
        { term: 'Entity-Relationship (ER)', definition: 'Técnica visual común para dibujar modelos de datos lógicos.' }
      ],
      insuranceExample: 'Conceptual: Cliente -(compra)-> Póliza. Lógico: Cliente (Id, Nombre, RFC) -(1:N)-> Póliza (Numero, Tipo, Prima). Físico: CREATE TABLE Poliza (Numero VARCHAR(20) PRIMARY KEY...).',
      tips: ['Nunca saltes al modelo físico. Validar el conceptual con los stakeholders ahora ahorra horas de rediseño técnico.', 'No todo debe estar en 3FN (Tercera Forma Normal) si es para Warehouse.'],
      commonErrors: ['Dejar que el ORM (ej. Hibernate) modele automáticamente bases de datos complejas sin revisión de un DBA.', 'Poner lógica de negocio en el modelo donde no corresponde.'],
      frameworks: ['DAMA-DMBOK2', 'Notación IDEF1X']
    },
    quiz: [
      { id: 'q1', question: '¿Qué modelo describe entidades de negocio de muy alto nivel, sin detalles técnicos, para ser entendido por el CEO?', options: ['Lógico', 'Físico', 'Conceptual', 'Objeto'], correctAnswer: 2, explanation: 'El Modelo Conceptual es el de mayor abstracción.' },
      { id: 'q2', question: 'El tipo de dato VARCHAR(50) se define típicamente en el modelo...', options: ['Físico', 'Lógico', 'Conceptual', 'Negocio'], correctAnswer: 0, explanation: 'Los tipos de datos específicos del RDMS van en el físico.' },
      { id: 'q3', question: 'Normalización se usa para evitar anomalías de actualización.', options: ['Verdadero', 'Falso'], correctAnswer: 0, explanation: 'Verdadero. Evita redundancia perjudicial en transaccional.' },
      { id: 'q4', question: 'En un modelo de Data Warehouse (Analítico), siempre se usa la 3ra Forma Normal (3FN).', options: ['Verdadero', 'Falso'], correctAnswer: 1, explanation: 'Falso. Se suele denormalizar (ej. Esquema Estrella) para velocidad de lectura.' },
      { id: 'q5', question: '¿Qué es una clave primaria (PK)?', options: ['Un índice aleatorio.', 'Un atributo que identifica unívocamente un registro.', 'Un valor foráneo.', 'Una constante.'], correctAnswer: 1, explanation: 'Una PK es única en la tabla.' }
    ]
  },
  {
    id: 'm5_calidad',
    title: 'Calidad de Datos',
    description: 'Garantizar que los datos cumplan las dimensiones clave.',
    content: {
      theory: 'La calidad de datos no es perfección 100%, es ser "Apto para su uso previsto". Dimensiones principales de calidad (DAMA): Exactitud, Completitud, Consistencia, Integridad, Oportunidad, y Validez.',
      glossary: [
        { term: 'Perfilado de Datos (Profiling)', definition: 'Análisis estadístico automatizado de los datos para descubrir errores (nulos, formatos).' }
      ],
      insuranceExample: 'Si la fecha de nacimiento en el CRM es 01/01/1800, falla la *Validez* y *Exactitud*. Resultado: La póliza automática calcula una prima astronómica por edad. Un simple rule de validación frontal resuelve esto.',
      tips: ['Corrige en la fuente, no en el Data Warehouse (Shift-Left in Data).', 'Involucra al usuario final, él sufre los errores.'],
      commonErrors: ['Esperar limpiar todo y al 100%', 'Mandar archivos Excel al equipo de TI pidiendo "encuentren errores".'],
      frameworks: ['DAMA, Reglas 6 Dimensiones']
    },
    quiz: [
      { id: 'q1', question: 'Un campo "email" tiene valores sin la arroba (@). ¿Qué dimensión falla?', options: ['Completitud', 'Oportunidad', 'Validez', 'Singularidad'], correctAnswer: 2, explanation: 'Validez comprueba que el formato sea correcto según las reglas de negocio.' },
      { id: 'q2', question: 'La calidad de datos exige que el 100% de los datos estén limpios.', options: ['Verdadero', 'Falso'], correctAnswer: 1, explanation: 'Falso. Se priorizan los Critical Data Elements (CDEs) y el nivel "fit for purpose".' },
      { id: 'q3', question: 'La regla de oro de remediación es: arreglar el error en el sistema de reporte final.', options: ['Verdadero', 'Falso'], correctAnswer: 1, explanation: 'Falso. Se debe arreglar en la fuente (Source system).' },
      { id: 'q4', question: 'Las operaciones de data profiling buscan...', options: ['Mandar spam.', 'Analizar el estado de los datos (nulos, máximos, frecuencias).', 'Borrar datos viejos.', 'Encriptar passwords.'], correctAnswer: 1, explanation: 'El profiling ayuda a entender la estructura y detectar defectos tempranos.' },
      { id: 'q5', question: 'Si llega información útil un mes tarde para la decisión de campaña, falla la dimensión de:', options: ['Integridad.', 'Oportunidad (Timeliness).', 'Completitud.', 'Exactitud.'], correctAnswer: 1, explanation: 'La oportunidad mide la disponibilidad de la información en el momento requerido.' }
    ]
  },
  {
    id: 'm6_seguridad',
    title: 'Seguridad de Datos',
    description: 'Proteger la confidencialidad, integridad y disponibilidad (CIA)',
    content: {
      theory: 'Un Data Manager debe asegurar que los activos estén protegidos de accesos no autorizados. Pilares CIA: Confidencialidad (solo a quien deba), Integridad (no se manipulen mal), Availability (estén disponibles cuando los necesiten). Uso de RBAC (Role-Based Access) y enmascarado.',
      glossary: [ { term: 'Enmascaramiento', definition: 'Ocultar partes del dato (ej. ****-1234) para visualización insegura.' } ],
      insuranceExample: 'Los analistas no necesitan ver el "historial médico" exacto, sólo la clasificación de riesgo (Alta, Media, Baja). La seguridad dicta un modelo de Masking para analistas y cifrado en bases de datos.',
      tips: ['Privacidad por diseño: piensa en seguridad antes de desarrollar.', 'Aplica "Principio de Menor Privilegio".'],
      commonErrors: ['Dar acceso admin a toda el área de BI.', 'Olvidar borrar accesos de empleados despedidos.'],
      frameworks: ['ISO 27001', 'NIST']
    },
    quiz: [
      { id: 'q1', question: 'El principio de menor privilegio (PoLP) significa:', options: ['Nadie tiene acceso.', 'Los usuarios tienen exactamente el acceso que necesitan para su rol, ni más ni menos.', 'Usar contraseñas cortas.', 'Los gerentes pueden ver todo.'], correctAnswer: 1, explanation: 'El PoLP limita la exposición al riesgo.' },
      { id: 'q2', question: 'El término CIA Triad significa:', options: ['Agencia Central de Inteligencia.', 'Certificados, Identidad, Arquitectura.', 'Confidentiality, Integrity, Availability.', 'Computing, Internet, Analytics.'], correctAnswer: 2, explanation: 'La triada básica de la seguridad de información.' },
      { id: 'q3', question: 'Enmascarar u ofuscar datos PII (información personal) en entornos de prueba ayuda a prevenir fugas.', options: ['Verdadero', 'Falso'], correctAnswer: 0, explanation: 'Verdadero. Test data masking es una práctica obligatoria hoy.' },
      { id: 'q4', question: 'RBAC significa Role-Based Access Control.', options: ['Verdadero', 'Falso'], correctAnswer: 0, explanation: 'Verdadero. Asigna permisos según perfiles o roles.' },
      { id: 'q5', question: 'La ISO más relacionada con Sistemas de Gestión de Seguridad de la Información es:', options: ['ISO 9001', 'ISO 14001', 'ISO 27001', 'ISO 20000'], correctAnswer: 2, explanation: '27001 es el estándar rey en seguridad.' }
    ]
  },
  {
    id: 'm7_stewardship',
    title: 'Data Stewardship',
    description: 'Gestión táctica y del día a día sobre los datos.',
    content: {
      theory: 'Mientras el Data Owner aprueba políticas (estratégico), el Data Steward (Custodio/Garante) las ejerce (táctico). Define definiciones de negocio, captura metadatos, resuelve errores de calidad y apoya a los usuarios finales.',
      glossary: [ { term: 'Data Steward', definition: 'Puesto que actúa de lazo entre IT y Negocio para garantizar la utilidad del dato experto.' } ],
      insuranceExample: 'El Steward de "Siniestros" pasa su día revisando reportes de profiling, corrigiendo códigos en la tabla maestra (MDM) y capacitando analistas sobre cómo cruzar datos.',
      tips: ['Un buen Steward entiende SQL y el proceso de venta simultáneamente.', 'Evita usar Data Stewards sólo como "limpiadores de datos".'],
      commonErrors: ['Creer que el Data Steward limpia datos.', 'Poner Stewards pasivos que solo llenan plantillas.'],
      frameworks: ['DAMA']
    },
    quiz: [
      { id: 'q1', question: 'Diferencia principal entre Owner y Steward:', options: ['Owner es Operativo, Steward Estratégico', 'Owner aprueba y se responsabiliza, Steward ejecuta y vigila', 'Owner es de TI, Steward es de Negocio', 'Son lo mismo'], correctAnswer: 1, explanation: 'El Steward hace el trabajo del día a día en nombre del Owner.' },
      { id: 'q2', question: 'El Steward se encarga de crear el diccionario de datos de su área.', options: ['Verdadero', 'Falso'], correctAnswer: 0, explanation: 'Verdadero. Es quien mejor conoce el significado y las reglas de negocio de su área.' },
      { id: 'q3', question: 'Un Data Steward no necesita comprender nada de la tecnología (bases de datos).', options: ['Verdadero', 'Falso'], correctAnswer: 1, explanation: 'Falso. Ocupa un conocimiento técnico-funcional puente para interactuar con TI.' },
      { id: 'q4', question: '¿Cuál no es una función de un Data Steward?', options: ['Modificar el firmware de los routers.', 'Apoyar en revisiones de calidad de datos.', 'Entrenar usuarios.', 'Definir términos en el glosario.'], correctAnswer: 0, explanation: 'Eso es red y hardware puro, fuera de su rol.' },
      { id: 'q5', question: 'Los Stewards pueden estar organizados por dominio (Ej. Stewards de Cliente, de Producto).', options: ['Verdadero', 'Falso'], correctAnswer: 0, explanation: 'Verdadero. Es la mejor forma de dividirlos.' }
    ]
  },
  {
    id: 'm8_catalog',
    title: 'Data Catalog y Metadata',
    description: 'El ADN explicativo de nuestros sistemas de información.',
    content: {
      theory: 'Metadatos son "datos sobre los datos". Pueden ser técnicos (ej. "Tipo integer(8)"), de negocio (ej. "Ingreso Bruto Mensual"), operacionales (ej. "Falla en el ETL a las 2AM"). El Catálogo de Datos es la herramienta web unificada para que analistas Googleen los datos.',
      glossary: [ { term: 'Linaje de Datos (Data Lineage)', definition: 'Mapa visual de de dónde viene un dato y a dónde va (trazabilidad).' } ],
      insuranceExample: 'Un usuario usa el Catálogo y busca "Prima Neta". Ve a su responsable (Steward), las fórmulas de cálculo oficial y sabe que la tabla validada vive en AWS Redshift. Así no usa un Excel viejo de recursos humanos.',
      tips: ['Si obligas a rellenarlo a mano sin automatización, en 2 meses estará desactualizado.', 'Integrar el catálogo con el Data Lake es mandatario.'],
      commonErrors: ['Documentar sistemas antiguos a punto de ser reemplazados.', 'Crear metadatos demasiado extensos que nadie lee.'],
      frameworks: ['DCAM', 'DAMA']
    },
    quiz: [
      { id: 'q1', question: 'Un metadato técnico es:', options: ['El teléfono del analista', 'El tipo de dato (VARCHAR) y la clave foránea', 'La definición de negocio de Ganancia Neta', 'El nombre del jefe'], correctAnswer: 1, explanation: 'Esa es información estructural del lado técnico.' },
      { id: 'q2', question: 'El Linaje de Datos es el mapeo del ciclo y trazabilidad.', options: ['Verdadero', 'Falso'], correctAnswer: 0, explanation: 'Verdadero, permite el rastreo de orígenes (root cause analysis).' },
      { id: 'q3', question: 'El principal propósito del Data Catalog es:', options: ['Aumentar la dificultad técnica.', 'Hacer los datos fácilmente descubribles y comprensibles (como un Google de datos).', 'Reemplazar las bases de datos.', 'Generar facturas.'], correctAnswer: 1, explanation: 'Buscabilidad, descubrimiento y confianza.' },
      { id: 'q4', question: 'Los metadatos operacionales incluyen información como la fecha del último escaneo de un proceso ETL.', options: ['Verdadero', 'Falso'], correctAnswer: 0, explanation: 'Sí, reflejan la operativa del ecosistema de datos.' },
      { id: 'q5', question: 'Un diccionario de datos normalmente se integra dentro de las capacidades de un Data Catalog moderno.', options: ['Verdadero', 'Falso'], correctAnswer: 0, explanation: 'Verdadero.' }
    ]
  },
  {
    id: 'm9_bigdata_cloud',
    title: 'Big Data y Cloud Computing',
    description: 'Tecnologías modernas de procesamiento y almacenamiento (AWS, GCP, Azure).',
    content: {
      theory: 'Cloud (IaaS, PaaS, SaaS) permite pagar por uso. Big Data rompe las barreras tradicionales con las 3 V: Volumen, Velocidad (streaming), Variedad (imágenes, textos). AWS (S3), GCP (BigQuery), Azure (Synapse) son pilares.',
      glossary: [ { term: 'Computación distribuida', definition: 'Usar múltiples computadoras para resolver un mismo problema (Ej. Spark, Hadoop).' } ],
      insuranceExample: 'Procesar las fotos de un choque (Variedad) de miles de autos (Volumen) en tiempo real para evitar fraude (Velocidad). Esto requiere Google Cloud Vision API o servicios escalables inasumibles en datacenters propios.',
      tips: ['La Nube no siempre es más barata si no la optimizas (FinOps).', 'Separa siempre el almacenamiento del cómputo para ahorrar costes.'],
      commonErrors: ['Hacer "Lift and Shift" (mover código viejo sin readaptar a los beneficios cloud).'],
      frameworks: ['FinOps']
    },
    quiz: [
      { id: 'q1', question: '¿Cuáles son las clásicas "Tres V" de Big Data?', options: ['Viento, Velocidad, Vida', 'Volumen, Velocidad, Variedad', 'Variedad, Verdad, Valor', 'Vector, Variable, Varianza'], correctAnswer: 1, explanation: '3Vs iniciales: Volumen (TB/PB), Velocidad (flujo), Variedad (No estructurado).' },
      { id: 'q2', question: 'En Nube, IaaS significa Infrastructure as a Service.', options: ['Verdadero', 'Falso'], correctAnswer: 0, explanation: 'Verdadero. Es el nivel base.' },
      { id: 'q3', question: 'Separar cómputo de almacenamiento significa:', options: ['Romper los discos duros.', 'Poder apagar los procesadores sin perder la información guardada para ahorrar.', 'Imprimir la información.', 'Tener dos proveedores diferentes.'], correctAnswer: 1, explanation: 'Esta es la premisa básica del abaratamiento de Data Clouds como Snowflake o BigQuery.' },
      { id: 'q4', question: 'GCP BigQuery es una herramienta de...', options: ['Edición de texto.', 'Un motor de Data Warehouse Serverless.', 'Una VPN.', 'Una billetera virtual.'], correctAnswer: 1, explanation: 'Es el servicio cloud estrella de datos analíticos de Google.' },
      { id: 'q5', question: 'Big Data sólo almacena datos estructurados, nunca fotos o videos.', options: ['Verdadero', 'Falso'], correctAnswer: 1, explanation: 'Falso. Big Data es experto en Variedad (fotos, textos libres, audios).' }
    ]
  },
  {
    id: 'm10_dhw_lake',
    title: 'Data Warehousing y Data Lake',
    description: 'Centralizando analítica corporativa moderna.',
    content: {
      theory: 'Data Warehouse (DWH): Centraliza la verdad empresarial con datos limpios, estructurados y perfilados (esquemas estrella). Data Lake: Guarda de todo (crudo, audios, json) rápido y sin estructura preconcebida. Data Lakehouse: Combinación moderna de ambos (Databricks, Snowflake).',
      glossary: [ { term: 'ETL / ELT', definition: 'Extract, Transform y Load (Load intermedio). Los procesos que mueven los datos.' } ],
      insuranceExample: 'Lake: Todas las notas de voz del asegurado, registros GPS web (barato). Warehouse: Tabla de Siniestros de Pólizas Vida validadas por contabilidad (costoso al validar, rápido de consultar).',
      tips: ['Crea un "Data Lake" gobernado en "zonas" (Bronce, Plata, Oro). Si no, en semanas tendrás un "Data Swamp" (Pantano de Datos).'],
      commonErrors: ['Intentar usar el DWH para guardar JSON no estructurados y petabytes que rompen el presupuesto.'],
      frameworks: ['Data Vault', 'Estrella (Kimball)']
    },
    quiz: [
      { id: 'q1', question: 'Un "Data Swamp" (Pantano) ocurre cuando...', options: ['Un Data Lake se vuelve inmanejable por falta de gobierno y catálogos.', 'El servidor se moja.', 'Cuando el DWH es muy limpio.', 'Cuando eliminas todos los datos.'], correctAnswer: 0, explanation: 'Un lago sin control se vuelve un pantano oscuro.' },
      { id: 'q2', question: 'Una diferencia clásica entre Data Lake y DWH es:', options: ['El Lake usa fotos físicas, DWH web.', 'El DWH es para datos procesados/estructurados; el Lake admite crudos/no estructurados.', 'El DWH cuesta $1, el Lake $1000.', 'Ninguna.'], correctAnswer: 1, explanation: 'El schema-on-read vs schema-on-write.' },
      { id: 'q3', question: 'Esquema Estrella es una técnica de modelado asociada comúnmente al Data Warehouse.', options: ['Verdadero', 'Falso'], correctAnswer: 0, explanation: 'Verdadero. Creado por Ralph Kimball, facilita el BI.' },
      { id: 'q4', question: 'ETL y ELT son idénticos matemáticamente.', options: ['Verdadero', 'Falso'], correctAnswer: 1, explanation: 'Falso. ETL transfiere en un servidor intermedio. ELT carga e invoca el poder masivo de la Base de Datos analítica (Nube).' },
      { id: 'q5', question: 'Un concepto moderno que fusiona ambos se llama...', options: ['Data Pond.', 'Data Lakehouse.', 'Data River.', 'Ocean Data.'], correctAnswer: 1, explanation: 'Ejemplo: Databricks.' }
    ]
  },
  {
    id: 'm11_mesh_fabric',
    title: 'Data Mesh y Data Fabric',
    description: 'Nuevos paradigmas organizativos y automatizados.',
    content: {
      theory: 'Data Mesh es un paradigma *organizativo descentralizado*: cada dominio (Marketing, Ventas) es dueño de construir sus "productos de datos" usando plataforma de TI. Data Fabric es un paradigma *tecnológico automatizado*: una red conectada que gestiona metadata con IA.',
      glossary: [ { term: 'Data as a Product', definition: 'Tratar salidas de datos con KPIs, soporte de ciclo de vida (SLA) para usuarios internos.' } ],
      insuranceExample: 'En Data Mesh, ya no hay un departamento cuasi divino "Equipo de Datos". El dominio "Cobranza de Rentas" produce y certifica su propia API y tablas de deudores y la expone al resto. Malla autogestionada.',
      tips: ['Data Mesh es un cambio sociotécnico (90% organizativo, 10% tech).', 'Aplica Data Mesh solo en empresas muy grandes y descentralizadas.'],
      commonErrors: ['Comprar un "Data Mesh In A Box" (No se puede comprar una forma de pensar).'],
      frameworks: ['Data Mesh (Zhamak Dehghani)']
    },
    quiz: [
      { id: 'q1', question: 'Data Mesh se enfoca principalmente en:', options: ['Algoritmos de IA', 'Automatización de cables físicos', 'Descentralización hacia equipos orientados a dominios de negocio', 'Vender servidores'], correctAnswer: 2, explanation: 'Atribuye la responsabilidad integral al que domina el negocio.' },
      { id: 'q2', question: 'Data as a Product (Datos como producto) es un principio de Data Mesh.', options: ['Verdadero', 'Falso'], correctAnswer: 0, explanation: 'Verdadero. Aplicar product management a los datos internos.' },
      { id: 'q3', question: 'El Data Fabric se recarga fuerte en la Inteligencia Artificial y metadatos activos.', options: ['Verdadero', 'Falso'], correctAnswer: 0, explanation: 'Verdadero. Busca interconectar nodos analizando sus metadatos de uso.' },
      { id: 'q4', question: 'Data Mesh es un producto de software de un vendedor.', options: ['Verdadero', 'Falso'], correctAnswer: 1, explanation: 'Falso. Es un framework organizativo conceptual.' },
      { id: 'q5', question: 'Para usar Data Mesh mi empresa debe tener 5 empleados en total.', options: ['Verdadero', 'Falso'], correctAnswer: 1, explanation: 'Falso. Es excesivo y antinatural en empresas pequeñas.' }
    ]
  },
  {
    id: 'm12_regulaciones',
    title: 'Regulaciones: GDPR, ISO y DAMA',
    description: 'Leyes y estándares internacionales alrededor de los datos.',
    content: {
      theory: 'Sin cumplir la ley, una empresa muere. GDPR (Europa) dictó el estándar de oro de protección con multas masivas. DAMA-DMBOK estandariza "cómo trabajar en la industria", e ISOs rigen la gestión documental y de sistemas de riesgo.',
      glossary: [ { term: 'Derecho al olvido', definition: 'El usuario exige que todo registro con sus datos personales sea destruido.' } ],
      insuranceExample: 'Si un cliente de seguro cancela y ejerce su Derecho al Olvido por GDPR, no puedes eliminarlo si la ley financiera de tu país exige guardar recibos por 10 años. Un Data Manager mediará qué se anonimiza y qué se destruye.',
      tips: ['El departamento de Privacidad es tu mejor amigo. Involúcralos temprano.', 'Conoce la diferencia entre dato anónimo (irreversible) e seudónimo (con clave reversible).'],
      commonErrors: ['Asumir que GDPR solo aplica si estás físicamente en la calle de Europa.'],
      frameworks: ['GDPR, CCPA (California)', 'ISO 27701 (Privacidad)']
    },
    quiz: [
      { id: 'q1', question: 'Bajo GDPR, ¿quién es dueño real de la información personal de un ciudadano?', options: ['La empresa', 'El ciudadano', 'El gobierno europeo', 'Nadie'], correctAnswer: 1, explanation: 'El pilar principal de leyes modernas: El sujeto del dato sigue controlándolo.' },
      { id: 'q2', question: 'El Derecho al Olvido es absoluto, se deban cumplir otras leyes o no.', options: ['Verdadero', 'Falso'], correctAnswer: 1, explanation: 'Falso. Leyes superiores (prevención lavado de dinero) superan el derecho a olvido.' },
      { id: 'q3', question: 'DAMA-DMBOK es el estándar/enciclopedia global no legislativo para directores de datos corporativos.', options: ['Verdadero', 'Falso'], correctAnswer: 0, explanation: 'Verdadero.' },
      { id: 'q4', question: 'Pseudonimizar significa borrar irreversiblemente la relación entre el dato y la persona.', options: ['Verdadero', 'Falso'], correctAnswer: 1, explanation: 'Falso. Eso es Anonimato. La pseudonimización permite revertirlo si se tiene la "llave" técnica.' },
      { id: 'q5', question: 'Multas de GDPR pueden llegar al 4% de la facturación global de la multinacional.', options: ['Verdadero', 'Falso'], correctAnswer: 0, explanation: 'Verdadero. Esta razón provocó que las empresas invirtieran masivamente en Data Management.' }
    ]
  },
  {
    id: 'm13_bi_analitica',
    title: 'Analítica y Business Intelligence',
    description: 'Transformación del dato a cuadros de mando e inferencias estadísticas.',
    content: {
      theory: 'BI usa datos estructurados para reportes retrospectivos (¿Qué pasó?). La Analítica Avanzada utiliza Data Science, machine learning o estadísticas predictivas (¿Qué pasará? ¿Qué recomendamos que pase?). Se soporta en Tableau, PowerBI, Python.',
      glossary: [ { term: 'Análisis Prescriptivo', definition: 'Modelos matemáticos u optimización que deciden qué debería hacerse de forma automática.' } ],
      insuranceExample: 'BI: Tablero directivo indicando la tasa de siniestros trimestral. Analítica Avanzada: Modelo que bloquea una reclamación sospechosa y envía a revisión manual basándose en picos sospechosos parecidos a fraudes históricos.',
      tips: ['Cuidado con el sesgo en el machine learning si tus datos originales tenían discriminación.', '"Un dashboard sin una decisión a tomar es solo arte".'],
      commonErrors: ['Hacer un dashboard con 50 gráficas que parecen tablero de avión.'],
      frameworks: ['CRISP-DM (Data Science)']
    },
    quiz: [
      { id: 'q1', question: 'Responder la pregunta "¿Qué pasó el mes pasado con las ventas?" recae en:', options: ['Machine Learning', 'Big Data', 'Business Intelligence Descriptivo', 'Robótica'], correctAnswer: 2, explanation: 'BI Descriptivo analiza lo pasado.' },
      { id: 'q2', question: 'El machine learning que predice un valor basado en tendencias (Ej. modelo lineal) pertenece a la analítica predictiva.', options: ['Verdadero', 'Falso'], correctAnswer: 0, explanation: 'Verdadero. Anticipa resultados.' },
      { id: 'q3', question: 'CRISP-DM es una metodología popular para elaborar tableros de BI exclusivamente.', options: ['Verdadero', 'Falso'], correctAnswer: 1, explanation: 'Falso. Es para proyectos de Data Science / ML.' },
      { id: 'q4', question: 'El valor final del BI se obtiene:', options: ['Sabiendo conectar los cables.', 'Cuando la dirección toma acciones correctivas gracias al reporte visual.', 'Instalando Power BI Premium.', 'Guardando gráficas en PDF.'], correctAnswer: 1, explanation: 'Toda gráfica debe promover un insight hacia una decisión.' },
      { id: 'q5', question: 'El análisis descriptivo es más lento y difícil de crear matemáticamente que el análisis prescriptivo.', options: ['Verdadero', 'Falso'], correctAnswer: 1, explanation: 'Falso. El descriptivo es el más fácil. El prescriptivo (optimización) es complejo.' }
    ]
  },
  {
    id: 'm14_stakeholders',
    title: 'Gestión de Stakeholders y Negocio',
    description: 'Habilidades corporativas y venta de la necesidad del Dato.',
    content: {
      theory: 'Sin stakeholders listos, la tecnología morirá en soledad. Identificar Sponsors ejecutivos. Calcular el Retorno de Inversión (ROI) o Casos de Uso (Use Cases) monetizados que demuestren ganancias para conseguir presupuestos en iniciativas de Datos.',
      glossary: [ { term: 'Stakeholder', definition: 'Toda persona o entidad impactada o que impacta al transcurso de la iniciativa de datos.' } ],
      insuranceExample: 'El Chief Marketing Officer solo quiere "vender". El Data Manager lo convence de invertir en calidad de datos al mostrar que "el 12% del presupuesto de pauta se gasta en mails duplicados o incorrectos". Muestra dinero ahorrado.',
      tips: ['Diseña matrices de interés y poder de los involucrados.', 'Funde el roadmap tecnológico en el roadmap corporativo empresarial.'],
      commonErrors: ['Aislarte con los arquitectos, perdiendo el norte de la urgencia comercial.'],
      frameworks: ['Matriz de Poder/Interés', 'TCO / ROI Analysis']
    },
    quiz: [
      { id: 'q1', question: 'Un buen líder de datos (CDO/Data Manager) justifica su labor...', options: ['Midiendo bytes procesados.', 'Aportando mayor valor y casos de uso de negocio con impacto financiero.', 'Escribiendo el mejor SQL del mundo.', 'Diciendo "no" a todo.'], correctAnswer: 1, explanation: 'El lenguaje de la junta directiva son las finanzas/valor.' },
      { id: 'q2', question: 'El área técnica nunca debe comunicarse con el negocio, las áreas deben ser silos.', options: ['Verdadero', 'Falso'], correctAnswer: 1, explanation: 'Falso. El Data Manager es la bisagra clave.' },
      { id: 'q3', question: '¿Para qué usarías la Matriz de Poder-Interés?', options: ['Para programar matrices en python.', 'Para saber a qué ejecutivos/aliados debes consultar/informar sobre tu proyecto de gobierno y gestionar cambios sociopolíticos.', 'Para saber si comprar AWS o Azure.', 'Para calcular calidad de datos.'], correctAnswer: 1, explanation: 'Gestionar prioridades políticas en la empresa moderna.' },
      { id: 'q4', question: 'Construir un "Business Case" ayuda a convencer de la compra de un Data Catalog demostrando cómo se paga a sí mismo.', options: ['Verdadero', 'Falso'], correctAnswer: 0, explanation: 'Verdadero. En TI, los budgets se liberan con Business Cases.' },
      { id: 'q5', question: 'Identificar al Sponsor Ejecutivo garantiza que todo será perfecto.', options: ['Verdadero', 'Falso'], correctAnswer: 1, explanation: 'Falso, pero remueve barreras burocráticas masivas.' }
    ]
  },
  {
    id: 'm15_soft_skills',
    title: 'Soft Skills Corporativas (Habilidades Blandas)',
    description: 'La clave del liderazgo moderno: Empatía, mentoría, resolución de conflictos.',
    content: {
      theory: 'Las habilidades interpersonales distinguen a un buen desarrollador técnico de un verdadero Líder de Datos (Data Manager, CDO). Implica comunicación asertiva, escucha activa a las quejas operativas, storytelling visual con insights y gestión ágil del cambio organizativo (Change Management).',
      glossary: [ { term: 'Storytelling de Datos', definition: 'El arte de contar una narrativa de empresa combinando datos críticos y visiones humanas visuales.' } ],
      insuranceExample: 'A los vendedores no les importan los IDs de Base de datos. Tu soft skill de Storytelling servirá para presentar cómo la nueva política de registrar correctamente los nombres mejorará sus comisiones 20% en 3 meses.',
      tips: ['Crea confianza, cumple lo que prometes (Delivery predictivo).', 'Traduce la jerga de IT a "Lenguaje Humano de Negocio".'],
      commonErrors: ['Arrogancia técnica (responder "son los bytes los que dictan de quién es la culpa").'],
      frameworks: ['ADKAR (Change Management)']
    },
    quiz: [
      { id: 'q1', question: 'El storytelling en datos consiste primordialmente en:', options: ['Usar PowerPoint con animaciones lentas.', 'Construir narrativas de impacto corporativo mezclando insights y emoción visual para que la gerencia accione.', 'Aprender SQL', 'Mentir usando la estadística.'], correctAnswer: 1, explanation: 'Storytelling = Contexto + Gráfica limpia + Recomendación clara.' },
      { id: 'q2', question: 'Las habilidades técnicas pesadas compensan totalmente el ser un líder inaccesible y arrogante para el avance en roles gerenciales de Datos.', options: ['Verdadero', 'Falso'], correctAnswer: 1, explanation: 'Falso. Sin Soft skills tu propuesta tecnológica genera constante rechazo en mandos medios y pares de negocio.' },
      { id: 'q3', question: 'Usar la analogía correcta, adaptada a la audiencia, permite que el negocio comprenda la urgencia de modernización arquitectónica.', options: ['Verdadero', 'Falso'], correctAnswer: 0, explanation: 'Verdadero, la "traducción" es un poder esencial de un líder de Datos Moderno.' },
      { id: 'q4', question: 'ADKAR es un marco orientado a...', options: ['Calidad del código.', 'Certificación estadística.', 'Gestión ágil del CÓMO la gente transiciona al cambio (Awareness, Desire...).', 'Desarrollo backend en Node.'], correctAnswer: 2, explanation: 'El Management of Change es la disciplina que garantiza adopción y mitigación de miedos sistemáticos.' },
      { id: 'q5', question: 'El Data Management sólo trata de computadoras, la cultura organizacional no influye en absoluto.', options: ['Verdadero', 'Falso'], correctAnswer: 1, explanation: 'Falso masivo. Más del 80% de obstáculos son sociopolíticos o culturales.' }
    ]
  }
];
