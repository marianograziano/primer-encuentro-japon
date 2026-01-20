import smtplib
import os
import zipfile
import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

# ===== CONFIGURACIÓN - EDITAR AQUÍ =====
SMTP_SERVER = "smtp.gmail.com"  # O smtp.hostinger.com
SMTP_PORT = 587
SENDER_EMAIL = "TU_CORREO@GMAIL.COM"
SENDER_PASSWORD = "TU_CONTRASEÑA_O_APP_PASSWORD" 
RECIPIENT_EMAILS = ["DESTINO1@EMAIL.COM", "DESTINO2@EMAIL.COM"]
# =======================================

PROJECT_DIR = "/var/www/viajemosajapon"
BACKUP_FILENAME = f"backup_viajemosajapon_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.zip"
BACKUP_PATH = os.path.join(PROJECT_DIR, BACKUP_FILENAME)

def create_backup():
    print(f"Creando backup en {BACKUP_PATH}...")
    with zipfile.ZipFile(BACKUP_PATH, 'w', zipfile.ZIP_DEFLATED) as zipf:
        # 1. Base de datos
        db_file = os.path.join(PROJECT_DIR, 'content.db')
        if os.path.exists(db_file):
            zipf.write(db_file, 'content.db')
        
        # 2. Uploads folder
        uploads_dir = os.path.join(PROJECT_DIR, 'uploads')
        if os.path.exists(uploads_dir):
            for root, dirs, files in os.walk(uploads_dir):
                for file in files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, PROJECT_DIR)
                    zipf.write(file_path, arcname)

def send_email():
    print("Conectando al servidor SMTP...")
    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = ", ".join(RECIPIENT_EMAILS)
    msg['Subject'] = f"Backup ViajemosAJapon - {datetime.date.today()}"
    body = "Adjunto encontrarás el backup automático del sistema (Base de datos + Imágenes)."
    msg.attach(MIMEText(body, 'plain'))

    # Adjuntar ZIP
    with open(BACKUP_PATH, "rb") as attachment:
        p = MIMEBase('application', 'octet-stream')
        p.set_payload(attachment.read())
        encoders.encode_base64(p)
        p.add_header('Content-Disposition', f"attachment; filename= {BACKUP_FILENAME}")
        msg.attach(p)

    try:
        s = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        s.starttls()
        s.login(SENDER_EMAIL, SENDER_PASSWORD)
        text = msg.as_string()
        s.sendmail(SENDER_EMAIL, RECIPIENT_EMAILS, text)
        s.quit()
        print("¡Correo enviado con éxito!")
    except Exception as e:
        print(f"Error al enviar correo: {e}")

if __name__ == "__main__":
    try:
        create_backup()
        send_email()
    finally:
        # Limpiar archivo local después de enviar (opcional, comentar para mantener)
        if os.path.exists(BACKUP_PATH):
            os.remove(BACKUP_PATH)
            print("Archivo temporal limpiado.")

