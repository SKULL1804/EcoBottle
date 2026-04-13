"""
EcoBottle — Email Service
Sends OTP emails via SMTP (Gmail, Mailgun, or any SMTP provider).
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import get_settings

settings = get_settings()


def send_otp_email(to_email: str, otp_code: str, purpose: str = "register"):
    """
    Send an OTP code via email.

    Args:
        to_email: Recipient email address
        otp_code: 6-digit OTP code
        purpose: 'register' or 'reset_password'
    """
    if purpose == "register":
        subject = "EcoBottle — Kode Verifikasi Registrasi"
        heading = "Verifikasi Email Anda"
        message = "Gunakan kode berikut untuk menyelesaikan registrasi akun EcoBottle Anda:"
    else:
        subject = "EcoBottle — Kode Reset Password"
        heading = "Reset Password"
        message = "Gunakan kode berikut untuk mereset password akun EcoBottle Anda:"

    html_body = f"""
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #f8fdf9; border-radius: 16px; overflow: hidden; border: 1px solid #e0f2e9;">
        <div style="background: linear-gradient(135deg, #10b981, #14b8a6); padding: 32px 24px; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 24px;">EcoBottle</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">{heading}</p>
        </div>
        <div style="padding: 32px 24px; text-align: center;">
            <p style="color: #374151; font-size: 14px; margin: 0 0 24px;">{message}</p>
            <div style="background: #fff; border: 2px dashed #10b981; border-radius: 12px; padding: 20px; display: inline-block;">
                <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #059669; font-family: monospace;">{otp_code}</span>
            </div>
            <p style="color: #9ca3af; font-size: 12px; margin: 24px 0 0;">Kode ini berlaku selama <strong>10 menit</strong>.</p>
            <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0;">Jika Anda tidak meminta kode ini, abaikan email ini.</p>
        </div>
        <div style="background: #f0fdf4; padding: 16px 24px; text-align: center; border-top: 1px solid #e0f2e9;">
            <p style="color: #6b7280; font-size: 11px; margin: 0;">© 2026 EcoBottle — Platform Daur Ulang Botol</p>
        </div>
    </div>
    """

    msg = MIMEMultipart("alternative")
    from_email = settings.SMTP_FROM_EMAIL or settings.SMTP_USERNAME
    msg["Subject"] = subject
    msg["From"] = f"EcoBottle <{from_email}>"
    msg["To"] = to_email

    # Plain text fallback
    plain_text = f"{heading}\n\nKode OTP Anda: {otp_code}\n\nKode berlaku 10 menit.\n\n— EcoBottle"
    msg.attach(MIMEText(plain_text, "plain"))
    msg.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_USERNAME, to_email, msg.as_string())
        print(f"OTP email sent to {to_email}")
        return True
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")
        return False
