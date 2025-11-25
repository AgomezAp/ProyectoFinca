import nodemailer from 'nodemailer'

export async function reservaPDF(reserva: any) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // Formatear fechas
    const fechaLlegada = new Date(reserva.fechaLlegada).toLocaleDateString('es-CO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const fechaSalida = new Date(reserva.fechaSalida).toLocaleDateString('es-CO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Calcular noches
    const llegada = new Date(reserva.fechaLlegada);
    const salida = new Date(reserva.fechaSalida);
    const noches = Math.ceil((salida.getTime() - llegada.getTime()) / (1000 * 3600 * 24));

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de Reserva - Finca El Progreso</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f8f9fa;
            }
            
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                border-radius: 15px;
                overflow: hidden;
            }
            
            .header {
                background: linear-gradient(135deg, #2d5f3f 0%, #1e4129 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
                position: relative;
            }
            
            .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="3" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="80" r="2" fill="rgba(255,255,255,0.1)"/></svg>');
                opacity: 0.3;
            }
                        
            .header h1 {
                font-size: 28px;
                margin-bottom: 10px;
                font-weight: 700;
                position: relative;
                z-index: 1;
            }
            
            .header p {
                font-size: 16px;
                opacity: 0.9;
                position: relative;
                z-index: 1;
            }
            
            .content {
                padding: 40px 30px;
            }
            
            .greeting {
                font-size: 18px;
                color: #2d5f3f;
                margin-bottom: 25px;
                font-weight: 600;
            }
            
            .success-message {
                background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
                border: 2px solid #b8dabc;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 30px;
                text-align: center;
            }
            
            .success-icon {
                font-size: 48px;
                color: #28a745;
                margin-bottom: 15px;
                display: block;
            }
            
            .success-text {
                color: #155724;
                font-size: 18px;
                font-weight: 600;
            }
            
            .reservation-details {
                background: #f8f9fa;
                border-radius: 12px;
                padding: 25px;
                margin-bottom: 30px;
                border: 1px solid #e9ecef;
            }
            
            .details-title {
                color: #2d5f3f;
                font-size: 20px;
                font-weight: 700;
                margin-bottom: 20px;
                text-align: center;
                border-bottom: 2px solid #d4a574;
                padding-bottom: 10px;
            }
            
            .detail-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 0;
                border-bottom: 1px solid #e9ecef;
            }
            
            .detail-row:last-child {
                border-bottom: none;
            }
            
            .detail-label {
                font-weight: 600;
                color: #495057;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .detail-value {
                font-weight: 500;
                color: #2d5f3f;
                text-align: right;
            }
            
            .highlight-box {
                background: linear-gradient(135deg, #2d5f3f 0%, #1e4129 100%);
                color: white;
                padding: 20px;
                border-radius: 12px;
                text-align: center;
                margin: 25px 0;
            }
            
            .highlight-box h3 {
                font-size: 18px;
                margin-bottom: 8px;
            }
            
            .highlight-box p {
                opacity: 0.9;
                font-size: 14px;
            }
            
            .next-steps {
                background: #fff3cd;
                border: 2px solid #ffeaa7;
                border-radius: 12px;
                padding: 20px;
                margin: 25px 0;
            }
            
            .next-steps h3 {
                color: #856404;
                margin-bottom: 15px;
                font-size: 18px;
            }
            
            .steps-list {
                list-style: none;
                padding: 0;
            }
            
            .steps-list li {
                padding: 8px 0;
                color: #856404;
                position: relative;
                padding-left: 25px;
            }
            
            .steps-list li::before {
                content: '✓';
                position: absolute;
                left: 0;
                color: #28a745;
                font-weight: bold;
            }
            
            .contact-info {
                background: #e7f3ff;
                border: 2px solid #b8daff;
                border-radius: 12px;
                padding: 20px;
                margin: 25px 0;
                text-align: center;
            }
            
            .contact-info h3 {
                color: #004085;
                margin-bottom: 15px;
            }
            
            .contact-details {
                color: #004085;
                font-weight: 500;
            }
            
            .footer {
                background: #f8f9fa;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e9ecef;
            }
            
            .footer p {
                color: #6c757d;
                font-size: 14px;
                margin-bottom: 10px;
            }
            
            .social-links {
                margin-top: 20px;
            }
            
            .social-links a {
                display: inline-block;
                margin: 0 10px;
                padding: 8px 15px;
                background: #2d5f3f;
                color: white;
                text-decoration: none;
                border-radius: 20px;
                font-size: 12px;
                transition: background 0.3s ease;
            }
            
            .reservation-id {
                background: linear-gradient(135deg, #d4a574 0%, #b8941f 100%);
                color: white;
                padding: 15px;
                border-radius: 8px;
                text-align: center;
                margin: 20px 0;
                font-weight: bold;
                letter-spacing: 1px;
            }
            
            @media (max-width: 600px) {
                .container {
                    margin: 10px;
                    border-radius: 10px;
                }
                
                .header, .content, .footer {
                    padding: 20px;
                }
                
                .detail-row {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 5px;
                }
                
                .detail-value {
                    text-align: left;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Header -->
            <div class="header">
                <h1>Finca El Progreso</h1>
                <p>Tu reserva ha sido confirmada exitosamente</p>
            </div>
            
            <!-- Content -->
            <div class="content">
                <div class="greeting">
                    ¡Hola ${reserva.nombre}! 👋
                </div>
                
                <div class="success-message">
                    <span class="success-icon">✅</span>
                    <div class="success-text">
                        ¡Reserva Confirmada con Éxito!
                    </div>
                </div>
                
                <p style="margin-bottom: 25px; color: #495057; line-height: 1.8;">
                    Nos complace confirmar que tu reserva en <strong>Finca El Progreso</strong> ha sido 
                    procesada exitosamente. Estamos emocionados de recibirte y hacer de tu estadía 
                    una experiencia inolvidable.
                </p>
                
                <!-- Reservation ID -->
                <div class="reservation-id">
                    ID de Reserva: #${reserva._id ? reserva._id.toString().slice(-8).toUpperCase() : 'FP' + Date.now().toString().slice(-6)}
                </div>
                
                <!-- Reservation Details -->
                <div class="reservation-details">
                    <h3 class="details-title">📋 Detalles de tu Reserva</h3>
                    
                    <div class="detail-row">
                        <span class="detail-label">👤 Huésped Principal:</span>
                        <span class="detail-value">${reserva.nombre}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">📧 Email:</span>
                        <span class="detail-value">${reserva.email}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">📱 Teléfono:</span>
                        <span class="detail-value">${reserva.telefono}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">📅 Fecha de Llegada:</span>
                        <span class="detail-value">${fechaLlegada}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">📅 Fecha de Salida:</span>
                        <span class="detail-value">${fechaSalida}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">🌙 Número de Noches:</span>
                        <span class="detail-value">${noches} ${noches === 1 ? 'noche' : 'noches'}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">👥 Número de Huéspedes:</span>
                        <span class="detail-value">${reserva.cantidad} ${reserva.cantidad === 1 ? 'persona' : 'personas'}</span>
                    </div>
                </div>
                
                <!-- Highlight Box -->
                <div class="highlight-box">
                    <h3>🎉 ¡Tu lugar está reservado!</h3>
                    <p>Hemos guardado tu reserva y estamos preparando todo para tu llegada.</p>
                </div>
                
                <!-- Next Steps -->
                <div class="next-steps">
                    <h3>📝 Próximos Pasos:</h3>
                    <ul class="steps-list">
                        <li>Recibirás una confirmación telefónica en las próximas 24 horas</li>
                        <li>Te enviaremos las indicaciones de llegada por WhatsApp</li>
                        <li>Podrás realizar el check-in a partir de las 3:00 PM</li>
                        <li>Guarda este correo como comprobante de tu reserva</li>
                    </ul>
                </div>
                
                <!-- Contact Info -->
                <div class="contact-info">
                    <h3>📞 ¿Necesitas ayuda?</h3>
                    <div class="contact-details">
                        <p><strong>WhatsApp:</strong> +573117414176</p>
                        <p><strong>Email:</strong> fincaelprogreso6@gmail.com</p>
                        <p><strong>Horario de atención:</strong> 8:00 AM - 8:00 PM</p>
                    </div>
                </div>
                
                <p style="margin-top: 30px; color: #495057; line-height: 1.8;">
                    Estamos ansiosos por recibirte en nuestra hermosa finca. Si tienes alguna pregunta 
                    o necesitas asistencia especial, no dudes en contactarnos.
                </p>
                
                <p style="margin-top: 20px; color: #2d5f3f; font-weight: 600; text-align: center;">
                    ¡Gracias por elegirnos y esperamos verte pronto! 🌿
                </p>
            </div>
            
            <!-- Footer -->
            <div class="footer">
                <p><strong>Finca El Progreso</strong></p>
                <p>Un lugar donde la naturaleza y el confort se encuentran</p>
                <p style="margin-top: 15px; font-size: 12px;">
                    Este es un correo automático, por favor no respondas a esta dirección.
                </p>
                
                <div class="social-links">
                    <a href="https://api.whatsapp.com/send/?phone=573117414176" style="background: #25d366;">WhatsApp</a>
                    <a href="https://www.facebook.com/profile.php?id=61578195997449" style="background: #1877f2;">Facebook</a>
                    <a href="https://www.instagram.com/fincael_progreso/" style="background: #e4405f;">Instagram</a>
                    <a href="https://www.tiktok.com/@finca_el_progreso" style="background: #000000;">TikTok</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: reserva.email,
        subject: '✅ Confirmación de Reserva - Finca El Progreso',
        html: htmlContent,
        // Agregar también texto plano para compatibilidad
        text: `
        Hola ${reserva.nombre},
        
        ¡Tu reserva en Finca El Progreso ha sido confirmada exitosamente!
        
        Detalles de la reserva:
        - Fecha de llegada: ${fechaLlegada}
        - Fecha de salida: ${fechaSalida}
        - Número de huéspedes: ${reserva.cantidad}
        - Número de noches: ${noches}
        
        Te contactaremos pronto para confirmar los detalles finales.
        
        ¡Gracias por elegirnos!
        
        Finca El Progreso
        WhatsApp: +57 311 741 4176
        Email: fincaelprogreso6@gmail.com
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Correo de confirmación enviado exitosamente a:', reserva.email);
    } catch (error) {
        console.error('❌ Error al enviar correo de confirmación:', error);
        throw error;
    }
}

export async function notificarAdminReserva(reserva: any) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // Formatear fechas
    const fechaLlegada = new Date(reserva.fechaLlegada).toLocaleDateString('es-CO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const fechaSalida = new Date(reserva.fechaSalida).toLocaleDateString('es-CO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Calcular noches
    const llegada = new Date(reserva.fechaLlegada);
    const salida = new Date(reserva.fechaSalida);
    const noches = Math.ceil((salida.getTime() - llegada.getTime()) / (1000 * 3600 * 24));

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nueva Reserva - Finca El Progreso</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f8f9fa;
            }
            
            .container {
                max-width: 700px;
                margin: 0 auto;
                background-color: #ffffff;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                border-radius: 15px;
                overflow: hidden;
            }
            
            .header {
                background: linear-gradient(135deg, #d97706, #f59e0b);
                color: white;
                padding: 30px;
                text-align: center;
            }
            
            .header h1 {
                font-size: 28px;
                margin-bottom: 10px;
            }
            
            .header p {
                font-size: 16px;
                opacity: 0.9;
            }
            
            .content {
                padding: 30px;
            }
            
            .alert {
                background: #fef3c7;
                border: 2px solid #fbbf24;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 25px;
                color: #92400e;
            }
            
            .section {
                margin-bottom: 25px;
            }
            
            .section-title {
                background: #f3f4f6;
                padding: 12px 15px;
                border-left: 4px solid #d97706;
                font-weight: 600;
                color: #1f2937;
                margin-bottom: 15px;
                border-radius: 4px;
            }
            
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
            }
            
            .info-item {
                background: #f9fafb;
                padding: 12px;
                border-radius: 6px;
                border: 1px solid #e5e7eb;
            }
            
            .info-label {
                font-weight: 600;
                color: #6b7280;
                font-size: 0.9rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .info-value {
                color: #1f2937;
                font-size: 1rem;
                margin-top: 5px;
            }
            
            .full-width {
                grid-column: 1 / -1;
            }
            
            .action-box {
                background: linear-gradient(135deg, #dcfce7, #bbf7d0);
                border: 2px solid #86efac;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                margin: 25px 0;
            }
            
            .action-box h3 {
                color: #166534;
                margin-bottom: 10px;
            }
            
            .action-box p {
                color: #15803d;
            }
            
            .documents-status {
                background: #f0f9ff;
                border: 1px solid #bfdbfe;
                border-radius: 8px;
                padding: 15px;
                margin-top: 15px;
            }
            
            .doc-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid #dbeafe;
            }
            
            .doc-item:last-child {
                border-bottom: none;
            }
            
            .doc-name {
                font-weight: 500;
                color: #1e40af;
            }
            
            .doc-status {
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 0.85rem;
                font-weight: 600;
            }
            
            .status-received {
                background: #dcfce7;
                color: #166534;
            }
            
            .footer {
                background: #f3f4f6;
                padding: 20px;
                text-align: center;
                border-top: 1px solid #e5e7eb;
                font-size: 0.9rem;
                color: #6b7280;
            }
            
            @media (max-width: 600px) {
                .info-grid {
                    grid-template-columns: 1fr;
                }
                
                .container {
                    margin: 10px;
                    border-radius: 10px;
                }
                
                .content {
                    padding: 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Header -->
            <div class="header">
                <h1>🔔 Nueva Reserva Recibida</h1>
                <p>Finca El Progreso - Panel de Administrador</p>
            </div>
            
            <!-- Content -->
            <div class="content">
                <div class="alert">
                    ⚠️ <strong>Nueva solicitud de reserva</strong> - Requiere revisión y confirmación del cliente
                </div>
                
                <!-- Información del Cliente -->
                <div class="section">
                    <div class="section-title">👤 Información del Cliente</div>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">Nombre Completo</div>
                            <div class="info-value">${reserva.nombre}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Documento (Cédula)</div>
                            <div class="info-value">${reserva.cc}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Correo Electrónico</div>
                            <div class="info-value">${reserva.email}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Teléfono</div>
                            <div class="info-value">${reserva.telefono}</div>
                        </div>
                    </div>
                </div>
                
                <!-- Detalles de la Reserva -->
                <div class="section">
                    <div class="section-title">📅 Detalles de la Reserva</div>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">Check-in</div>
                            <div class="info-value">${fechaLlegada}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Check-out</div>
                            <div class="info-value">${fechaSalida}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Número de Noches</div>
                            <div class="info-value">${noches} ${noches === 1 ? 'noche' : 'noches'}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Número de Huéspedes</div>
                            <div class="info-value">${reserva.cantidad} ${reserva.cantidad === 1 ? 'persona' : 'personas'}</div>
                        </div>
                    </div>
                </div>
                
                <!-- Estado de Documentos -->
                <div class="section">
                    <div class="section-title">📄 Documentos Cargados</div>
                    <div class="documents-status">
                        <div class="doc-item">
                            <span class="doc-name">Documento - Lado Frontal</span>
                            <span class="doc-status status-received">✓ Recibido</span>
                        </div>
                        <div class="doc-item">
                            <span class="doc-name">Documento - Lado Posterior</span>
                            <span class="doc-status status-received">✓ Recibido</span>
                        </div>
                        <div class="doc-item">
                            <span class="doc-name">Foto con Documento en Mano</span>
                            <span class="doc-status status-received">✓ Recibido</span>
                        </div>
                    </div>
                </div>
                
                <!-- Próximos Pasos -->
                <div class="action-box">
                    <h3>📋 Próximos Pasos</h3>
                    <p>Verifica los documentos en el panel de administración y confirma o rechaza esta reserva.</p>
                </div>
                
                <div class="section">
                    <div class="section-title">🔗 ID de Reserva</div>
                    <div class="info-grid full-width">
                        <div class="info-item" style="background: #fef3c7; border: 2px solid #fcd34d;">
                            <div class="info-label">Identificador Único</div>
                            <div class="info-value" style="font-weight: bold; font-size: 1.2rem; color: #92400e;">
                                ${reserva._id ? reserva._id.toString().slice(-8).toUpperCase() : 'FP' + Date.now().toString().slice(-6)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
                <p><strong>Finca El Progreso</strong></p>
                <p>Este es un correo automático del panel de administración. No responda a este correo.</p>
                <p style="margin-top: 15px; font-size: 0.85rem;">
                    Accede a tu panel para gestionar esta reserva: <br>
                    <strong>Dashboard de Administración</strong>
                </p>
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_ADMIN || process.env.EMAIL_USER,
        subject: `🆕 Nueva Reserva - ${reserva.nombre} (${noches} noches)`,
        html: htmlContent,
        text: `
        Nueva reserva recibida de: ${reserva.nombre}
        
        Información del Cliente:
        - Nombre: ${reserva.nombre}
        - Cédula: ${reserva.cc}
        - Email: ${reserva.email}
        - Teléfono: ${reserva.telefono}
        
        Detalles de la Reserva:
        - Check-in: ${fechaLlegada}
        - Check-out: ${fechaSalida}
        - Noches: ${noches}
        - Huéspedes: ${reserva.cantidad}
        
        Documentos recibidos:
        - Documento frontal: ✓
        - Documento posterior: ✓
        - Foto con documento: ✓
        
        ID de Reserva: ${reserva._id ? reserva._id.toString().slice(-8).toUpperCase() : 'FP' + Date.now().toString().slice(-6)}
        
        Accede al panel para confirmar o rechazar esta reserva.
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Notificación enviada al admin exitosamente');
        return { success: true, message: 'Notificación enviada al admin' };
    } catch (error) {
        console.error('❌ Error al enviar notificación al admin:', error);
        throw error;
    }
}

export const funEnviarMensaje = async(
    phoneNumberCliente: string,
    phoneNumberMaestro: string,
    nombreDelCliente: string,
    message: string
): Promise<any> => {
    try {
        // Validar que la URL esté configurada
        if (!process.env.API_NOTIFICACION_URL) {
            throw new Error('API_NOTIFICACION_URL no está configurada en las variables de entorno');
        }

        // Validar números de teléfono
        if (!phoneNumberCliente || !phoneNumberMaestro) {
            throw new Error('Los números de teléfono son requeridos');
        }

        // Validar mensaje
        if (!message || message.trim().length === 0) {
            throw new Error('El mensaje no puede estar vacío');
        }

        const url = `${process.env.API_NOTIFICACION_URL}/api/messages/CrearMensaje`;

        const apiResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': '181.129.218.198'
            },
            body: JSON.stringify({
                sessionId: '1234',
                phoneNumberCliente,
                phoneNumberMaestro,
                nombreDelCliente,
                message
            })
        });

        console.log('📤 Respuesta API:', apiResponse.status, apiResponse.statusText);

        if (!apiResponse.ok) {
            const errorResponse = await apiResponse.text();
            console.error('❌ Error en respuesta API:', errorResponse);
            throw new Error(`Error al enviar mensaje: ${apiResponse.status} - ${errorResponse}`);
        }

        const apiResult = await apiResponse.json();

        console.log('✅ Mensaje enviado exitosamente:', apiResult);

        return apiResult;
    } catch (error) {
        console.error('❌ Error en funEnviarMensaje:', error);
        throw error;
    }
}