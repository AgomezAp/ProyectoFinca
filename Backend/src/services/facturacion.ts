import PdfPrinter from 'pdfmake'
import nodemailer from 'nodemailer'
import { content } from 'pdfkit/js/page';
export async function crearPDF(reserva: any): Promise<Buffer> {
   const fonts = {
      Helvetica: {
         normal: 'Helvetica',
         bold: 'Helvetica-Bold',
         italics: 'Helvetica-Oblique',
         bolditalics: 'Helvetica-BoldOblique'
      }
   };
    const fechaLlegada = new Date(reserva.fechaLlegada);
    const fechaSalida = new Date(reserva.fechaSalida);
    const diffTime = fechaSalida.getTime() - fechaLlegada.getTime();
    const cantidadNoches = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const Factura = new PdfPrinter(fonts);
    const contenido = [
        {
            columns: [
                {
                    width: '*',
                    stack: [
                        // Aquí puedes poner una imagen de tu logo si la tienes base64 codificada
                        // { image: 'data:image/png;base64,...', width: 100, margin: [0, 0, 0, 10] },
                        { text: 'El Progreso', style: 'headerCompany' },
                        { text: '[Tu Dirección Completa de la Finca]', style: 'subHeader' },
                        { text: 'Teléfono: [Tu Número de Teléfono]', style: 'subHeader' },
                        { text: 'Email: [Tu Correo Electrónico]', style: 'subHeader' },
                        { text: 'NIT/Razón Social: [Tu NIT/Razón Social si aplica]', style: 'subHeader' }
                    ]
                },
                {
                    width: 'auto',
                    stack: [
                        { text: 'FACTURA DE VENTA', style: 'invoiceTitle' },
                        { text: `Nº Factura: ${numeracion()}`, style: 'invoiceInfo' },
                        { text: `Fecha: ${new Date().toLocaleDateString('es-CO')}`, style: 'invoiceInfo' },
                        // { text: `Fecha Vencimiento: ${reserva.fechaVencimiento || 'N/A'}`, style: 'invoiceInfo' }
                    ],
                    alignment: 'right'
                }
            ],
            margin: [0, 0, 0, 20] // Margen inferior
        },

        // --- Información del Huésped ---
        { text: 'Información del Huésped', style: 'sectionTitle' },
        {
            columns: [
                {
                    width: '*',
                    stack: [
                        { text: `Nombre: ${reserva.nombre|| 'N/A'}`, style: 'guestInfo' },
                        { text: `Identificación: ${reserva.cc || 'N/A'}`, style: 'guestInfo' },
                    ]
                },
                {
                    width: '*',
                    stack: [
                        { text: `Teléfono: ${reserva.telefono || 'N/A'}`, style: 'guestInfo' },
                        { text: `Email: ${reserva.email || 'N/A'}`, style: 'guestInfo' }
                    ]
                }
            ],
            margin: [0, 0, 0, 20]
        },

        // --- Detalles del Servicio (Tabla) ---
        { text: 'Detalles del Servicio', style: 'sectionTitle' },
        {
            style: 'tableExample',
            table: {
                widths: ['*', 'auto', 'auto', 'auto'],
                body: [
                    // Encabezados de la tabla
                    [{ text: 'Descripción', style: 'tableHeader' }, { text: 'Cantidad', style: 'tableHeader' }, { text: 'Tarifa Uni.', style: 'tableHeader' }, { text: 'Subtotal', style: 'tableHeader' }],
                    
                    // Fila de Alojamiento (ejemplo, asumiendo datos en reserva.detallesServicio)
                    [
                        `Alojamiento para ${reserva.cantidad} personas`,
                        `${cantidadNoches} Noches`,
                        `$${(0).toLocaleString('es-CO')}`, // Formato de moneda
                        `$${(0).toLocaleString('es-CO')}`
                    ],
                    
                    // Otras filas de servicios (puedes iterar sobre un array de servicios adicionales en reserva.serviciosAdicionales)
                    ...(/*reserva.serviciosAdicionales ||*/ []).map((servicio: any) => [
                        servicio.descripcion,
                        `${servicio.cantidad}`,
                        `$${(servicio.precioUnitario || 0).toLocaleString('es-CO')}`,
                        `$${(servicio.cantidad * servicio.precioUnitario || 0).toLocaleString('es-CO')}`
                    ])
                    // ... más filas si es necesario
                ]
            },
            layout: {
                fillColor: function (rowIndex: number, node: any, columnIndex: number) {
                    return (rowIndex % 2 === 0) ? '#F5F5F5' : null; // Color de fila alternado
                },
                hLineWidth: function(i: number, node: any) { return (i === 0 || i === node.table.body.length) ? 1 : 0.5; },
                vLineWidth: function(i: number, node: any) { return (i === 0 || i === node.table.widths.length) ? 1 : 0.5; },
                hLineColor: function(i: number, node: any) { return (i === 0 || i === node.table.body.length) ? '#BBBBBB' : '#DDDDDD'; },
                vLineColor: function(i: number, node: any) { return (i === 0 || i === node.table.widths.length) ? '#BBBBBB' : '#DDDDDD'; },
            },
            margin: [0, 0, 0, 20]
        },

        // --- Totales ---
        {
            columns: [
                { width: '*', text: '' }, // Columna vacía para alinear a la derecha
                {
                    width: 'auto',
                    table: {
                        body: [
                            [{ text: 'Subtotal:', alignment: 'right', style: 'totalLabel' }, { text: `$${(reserva.subtotal || 0).toLocaleString('es-CO')}`, alignment: 'right', style: 'totalValue' }],
                            [{ text: `IVA (19%):`, alignment: 'right', style: 'totalLabel' }, { text: `$${(reserva.valorIVA || 0).toLocaleString('es-CO')}`, alignment: 'right', style: 'totalValue' }],
                            [{ text: 'Otros Cargos:', alignment: 'right', style: 'totalLabel' }, { text: `$${(reserva.otrosCargos || 0).toLocaleString('es-CO')}`, alignment: 'right', style: 'totalValue' }],
                            [{ text: 'TOTAL A PAGAR:', alignment: 'right', style: 'grandTotalLabel' }, { text: `$${(reserva.totalAPagar || 0).toLocaleString('es-CO')}`, alignment: 'right', style: 'grandTotalValue' }]
                        ]
                    },
                    layout: 'noBorders' // Para que la tabla de totales no tenga bordes
                }
            ],
            margin: [0, 0, 0, 20]
        },

        // --- Instrucciones de Pago ---
        { text: 'Instrucciones de Pago', style: 'sectionTitle' },
        { text: 'Por favor, realice el pago a través de:', style: 'body' },
        {
            ul: [
                'Transferencia Bancaria: [Nombre del Banco], Cuenta de Ahorros/Corriente: [Número de Cuenta], Titular: [Nombre del Titular], NIT/C.C.: [NIT/C.C. del Titular]',
                '[Otro Método de Pago, ej. PSE, Tarjeta de Crédito vía pasarela de pagos]'
            ],
            style: 'body',
            margin: [0, 0, 0, 20]
        },

        // --- Pie de Página ---
        { text: '"Factura generada electrónicamente, válida para fines contables."', style: 'footer' },
        { text: '¡Gracias por su visita!', style: 'footer', alignment: 'center', margin: [0, 5, 0, 0] }
    ];

    // --- Estilos de la Factura ---
    const estilos = {
        headerCompany: {
            fontSize: 20,
            bold: true,
            color: '#007bff' // Color azul de la marca
        },
        subHeader: {
            fontSize: 10,
            margin: [0, 2, 0, 0]
        },
        invoiceTitle: {
            fontSize: 24,
            bold: true,
            color: '#333333'
        },
        invoiceInfo: {
            fontSize: 12,
            margin: [0, 2, 0, 0]
        },
        sectionTitle: {
            fontSize: 16,
            bold: true,
            margin: [0, 15, 0, 5],
            color: '#007bff'
        },
        guestInfo: {
            fontSize: 12,
            margin: [0, 3, 0, 0]
        },
        tableExample: {
            margin: [0, 5, 0, 15]
        },
        tableHeader: {
            bold: true,
            fontSize: 12,
            color: '#555555',
            fillColor: '#F2F2F2',
            alignment: 'center',
            margin: [5, 5, 5, 5]
        },
        body: {
            fontSize: 12,
            margin: [0, 5, 0, 0]
        },
        totalLabel: {
            fontSize: 12,
            bold: true,
            margin: [0, 2, 0, 2]
        },
        totalValue: {
            fontSize: 12,
            margin: [0, 2, 0, 2]
        },
        grandTotalLabel: {
            fontSize: 14,
            bold: true,
            color: '#007bff',
            margin: [0, 5, 0, 0]
        },
        grandTotalValue: {
            fontSize: 14,
            bold: true,
            color: '#007bff',
            margin: [0, 5, 0, 0]
        },
        footer: {
            fontSize: 10,
            italics: true,
            color: '#777777',
            margin: [0, 20, 0, 0],
            alignment: 'center'
        }
    };

    const docDefinition = {
      pageSize: 'A4',
      content: contenido,
      styles: estilos,
      defaultStyle: {
         font: "Helvetica"
      }
    };

    const pdfDoc = Factura.createPdfKitDocument(docDefinition as any);

    return new Promise<Buffer>((resolve, reject) => {
        const chunks: any[] = [];
        pdfDoc.on("data",(chunk) => chunks.push(chunk));
        pdfDoc.on("end", () => resolve(Buffer.concat(chunks)));
        pdfDoc.on("error", (err)=> reject(err));
        pdfDoc.end();
    });
};

export async function crearYEnviarPDF(reserva: any): Promise<{succes: boolean, message: string}> {
   const fonts = {
      Helvetica: {
         normal: 'Helvetica',
         bold: 'Helvetica-Bold',
         italics: 'Helvetica-Oblique',
         bolditalics: 'Helvetica-BoldOblique'
      }
   };

   try {
    const fechaLlegada = new Date(reserva.fechaLlegada);
    const fechaSalida = new Date(reserva.fechaSalida);
    const diffTime = fechaSalida.getTime() - fechaLlegada.getTime();
    const cantidadNoches = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const Factura = new PdfPrinter(fonts);
    const contenido = [
        {
            columns: [
                {
                    width: '*',
                    stack: [
                        // Aquí puedes poner una imagen de tu logo si la tienes base64 codificada
                        // { image: 'data:image/png;base64,...', width: 100, margin: [0, 0, 0, 10] },
                        { text: 'El Progreso', style: 'headerCompany' },
                        { text: '[Tu Dirección Completa de la Finca]', style: 'subHeader' },
                        { text: 'Teléfono: [Tu Número de Teléfono]', style: 'subHeader' },
                        { text: 'Email: [Tu Correo Electrónico]', style: 'subHeader' },
                        { text: 'NIT/Razón Social: [Tu NIT/Razón Social si aplica]', style: 'subHeader' }
                    ]
                },
                {
                    width: 'auto',
                    stack: [
                        { text: 'FACTURA DE VENTA', style: 'invoiceTitle' },
                        { text: `Nº Factura: ${numeracion()}`, style: 'invoiceInfo' },
                        { text: `Fecha: ${new Date().toLocaleDateString('es-CO')}`, style: 'invoiceInfo' },
                        // { text: `Fecha Vencimiento: ${reserva.fechaVencimiento || 'N/A'}`, style: 'invoiceInfo' }
                    ],
                    alignment: 'right'
                }
            ],
            margin: [0, 0, 0, 20] // Margen inferior
        },

        // --- Información del Huésped ---
        { text: 'Información del Huésped', style: 'sectionTitle' },
        {
            columns: [
                {
                    width: '*',
                    stack: [
                        { text: `Nombre: ${reserva.nombre|| 'N/A'}`, style: 'guestInfo' },
                        { text: `Identificación: ${reserva.cc || 'N/A'}`, style: 'guestInfo' },
                    ]
                },
                {
                    width: '*',
                    stack: [
                        { text: `Teléfono: ${reserva.telefono || 'N/A'}`, style: 'guestInfo' },
                        { text: `Email: ${reserva.email || 'N/A'}`, style: 'guestInfo' }
                    ]
                }
            ],
            margin: [0, 0, 0, 20]
        },

        // --- Detalles del Servicio (Tabla) ---
        { text: 'Detalles del Servicio', style: 'sectionTitle' },
        {
            style: 'tableExample',
            table: {
                widths: ['*', 'auto', 'auto', 'auto'],
                body: [
                    // Encabezados de la tabla
                    [{ text: 'Descripción', style: 'tableHeader' }, { text: 'Cantidad', style: 'tableHeader' }, { text: 'Tarifa Uni.', style: 'tableHeader' }, { text: 'Subtotal', style: 'tableHeader' }],
                    
                    // Fila de Alojamiento (ejemplo, asumiendo datos en reserva.detallesServicio)
                    [
                        `Alojamiento para ${reserva.cantidad} personas`,
                        `${cantidadNoches} Noches`,
                        `$${(0).toLocaleString('es-CO')}`, // Formato de moneda
                        `$${(0).toLocaleString('es-CO')}`
                    ],
                    
                    // Otras filas de servicios (puedes iterar sobre un array de servicios adicionales en reserva.serviciosAdicionales)
                    ...(/*reserva.serviciosAdicionales ||*/ []).map((servicio: any) => [
                        servicio.descripcion,
                        `${servicio.cantidad}`,
                        `$${(servicio.precioUnitario || 0).toLocaleString('es-CO')}`,
                        `$${(servicio.cantidad * servicio.precioUnitario || 0).toLocaleString('es-CO')}`
                    ])
                    // ... más filas si es necesario
                ]
            },
            layout: {
                fillColor: function (rowIndex: number, node: any, columnIndex: number) {
                    return (rowIndex % 2 === 0) ? '#F5F5F5' : null; // Color de fila alternado
                },
                hLineWidth: function(i: number, node: any) { return (i === 0 || i === node.table.body.length) ? 1 : 0.5; },
                vLineWidth: function(i: number, node: any) { return (i === 0 || i === node.table.widths.length) ? 1 : 0.5; },
                hLineColor: function(i: number, node: any) { return (i === 0 || i === node.table.body.length) ? '#BBBBBB' : '#DDDDDD'; },
                vLineColor: function(i: number, node: any) { return (i === 0 || i === node.table.widths.length) ? '#BBBBBB' : '#DDDDDD'; },
            },
            margin: [0, 0, 0, 20]
        },

        // --- Totales ---
        {
            columns: [
                { width: '*', text: '' }, // Columna vacía para alinear a la derecha
                {
                    width: 'auto',
                    table: {
                        body: [
                            [{ text: 'Subtotal:', alignment: 'right', style: 'totalLabel' }, { text: `$${(reserva.subtotal || 0).toLocaleString('es-CO')}`, alignment: 'right', style: 'totalValue' }],
                            [{ text: `IVA (19%):`, alignment: 'right', style: 'totalLabel' }, { text: `$${(reserva.valorIVA || 0).toLocaleString('es-CO')}`, alignment: 'right', style: 'totalValue' }],
                            [{ text: 'Otros Cargos:', alignment: 'right', style: 'totalLabel' }, { text: `$${(reserva.otrosCargos || 0).toLocaleString('es-CO')}`, alignment: 'right', style: 'totalValue' }],
                            [{ text: 'TOTAL A PAGAR:', alignment: 'right', style: 'grandTotalLabel' }, { text: `$${(reserva.totalAPagar || 0).toLocaleString('es-CO')}`, alignment: 'right', style: 'grandTotalValue' }]
                        ]
                    },
                    layout: 'noBorders' // Para que la tabla de totales no tenga bordes
                }
            ],
            margin: [0, 0, 0, 20]
        },

        // --- Instrucciones de Pago ---
        { text: 'Instrucciones de Pago', style: 'sectionTitle' },
        { text: 'Por favor, realice el pago a través de:', style: 'body' },
        {
            ul: [
                'Transferencia Bancaria: [Nombre del Banco], Cuenta de Ahorros/Corriente: [Número de Cuenta], Titular: [Nombre del Titular], NIT/C.C.: [NIT/C.C. del Titular]',
                '[Otro Método de Pago, ej. PSE, Tarjeta de Crédito vía pasarela de pagos]'
            ],
            style: 'body',
            margin: [0, 0, 0, 20]
        },

        // --- Pie de Página ---
        { text: '"Factura generada electrónicamente, válida para fines contables."', style: 'footer' },
        { text: '¡Gracias por su visita!', style: 'footer', alignment: 'center', margin: [0, 5, 0, 0] }
    ];

    // --- Estilos de la Factura ---
    const estilos = {
        headerCompany: {
            fontSize: 20,
            bold: true,
            color: '#007bff' // Color azul de la marca
        },
        subHeader: {
            fontSize: 10,
            margin: [0, 2, 0, 0]
        },
        invoiceTitle: {
            fontSize: 24,
            bold: true,
            color: '#333333'
        },
        invoiceInfo: {
            fontSize: 12,
            margin: [0, 2, 0, 0]
        },
        sectionTitle: {
            fontSize: 16,
            bold: true,
            margin: [0, 15, 0, 5],
            color: '#007bff'
        },
        guestInfo: {
            fontSize: 12,
            margin: [0, 3, 0, 0]
        },
        tableExample: {
            margin: [0, 5, 0, 15]
        },
        tableHeader: {
            bold: true,
            fontSize: 12,
            color: '#555555',
            fillColor: '#F2F2F2',
            alignment: 'center',
            margin: [5, 5, 5, 5]
        },
        body: {
            fontSize: 12,
            margin: [0, 5, 0, 0]
        },
        totalLabel: {
            fontSize: 12,
            bold: true,
            margin: [0, 2, 0, 2]
        },
        totalValue: {
            fontSize: 12,
            margin: [0, 2, 0, 2]
        },
        grandTotalLabel: {
            fontSize: 14,
            bold: true,
            color: '#007bff',
            margin: [0, 5, 0, 0]
        },
        grandTotalValue: {
            fontSize: 14,
            bold: true,
            color: '#007bff',
            margin: [0, 5, 0, 0]
        },
        footer: {
            fontSize: 10,
            italics: true,
            color: '#777777',
            margin: [0, 20, 0, 0],
            alignment: 'center'
        }
    };

    const docDefinition = {
      pageSize: 'A4',
      content: contenido,
      styles: estilos,
      defaultStyle: {
         font: "Helvetica"
      }
    };

    const pdfDoc = Factura.createPdfKitDocument(docDefinition as any);

    const pdfBuffer =  await new Promise<Buffer>((resolve, reject) => {
        const chunks: any[] = [];
        pdfDoc.on("data",(chunk) => chunks.push(chunk));
        pdfDoc.on("end", () => resolve(Buffer.concat(chunks)));
        pdfDoc.on("error", (err)=> reject(err));
        pdfDoc.end();
    });

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const numeroFactura = await numeracion();
    const destinatario = reserva.email;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: destinatario,
        subject: `Factura de Reserva - Finca El Progreso - ${reserva.nombre}`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #007bff;">Finca El Progreso</h2>
            
            <p>Estimado/a <strong>${reserva.nombre}</strong>,</p>
            
            <p>Nos complace adjuntar la factura correspondiente a su reserva en nuestra finca.</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #007bff; margin-top: 0;>Detalles de la Reserva:</h3>
                <ul style="list-style: none; padding: 0;">
                    <li><strong>Numero de Factura:</strong> ${numeroFactura}</li>
                    <li><strong>Fecha de Llegada:</strong> ${reserva.fechaLlegada}</li>
                    <li><strong>Fecha de Salida:</strong> ${reserva.fechaSalida}</li>
                    <li><strong>Cantidad de Personas:</strong> ${reserva.cantidad}</li>
                    <li><strong>Noches:</strong> ${cantidadNoches}</li>
                </ul>
            </div>
            
            <p>La factura se encuentra adjunta en este correo en formato pdf</p>
            
            <div style="background-color: #e8f4f8; padding:15px; border-radius: 5px; margin: 20px 0;">
                <h4 style="color: #007bff; margin-top: 0">Instrucciones de pago;</h4>
                <p>Por favor, realice el pago a través de:</p>
                <ul>
                    <li>Transferencia Bancaria: [datos del banco]</li>
                    <li>[otros metodos]</li>
                </ul>
            </div>

            <p>Si tiene alguna pregunta sobre su factura o reserva, no dude en contactarnos.</p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
                <p style"color: #6c757d; font-size: 14px;">
                    Gracias por elegir Finca El Progreso.<br>
                    ¡Esperamos verle pronto!
                </p>
                <div style="margin-top: 15px; color: #6c757d; font-size:12px;">
                    <p><strong>Finca El Progreso</strong></p>
                    <p>📧 [Tu correo electrónico]</p>
                    <p>📞 [Tu número de teléfono]</p>
                    <p>📍 [Tu dirección]</p>
                </div>
            </div>
        </div>`,
        attachments: [
            {
                filename: `Factura-${reserva.nombre}-${numeroFactura}.pdf`,
                content: pdfBuffer,
                contentType: 'application/pdf'
            }
        ]
    };

    await transporter.sendMail(mailOptions);

    return {
        succes: true,
        message: `Factura enviada exitosamente a ${destinatario}`
    };
    } catch (error) {
      console.error('Error al crear y enviar PDF por correo:', error);
      return {
         succes: false,
         message: `Error al enviar la factura: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
   }
};

// Variable para llevar la numeración de facturas
let numeroActualFactura = 1;

export async function numeracion() {
    const numeroFormateado = numeroActualFactura.toString().padStart(4, '0');
    numeroActualFactura += 1;
    return numeroFormateado;
}