from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from app.core.config import settings
from typing import List

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

fast_mail = FastMail(conf)


async def send_verification_email(email: str, code: str, email_type: str) -> None:
    """发送验证码邮件"""
    if email_type == "register":
        subject = f"【{settings.MAIL_FROM_NAME}】注册验证码"
        body = f"""
        <html>
            <body>
                <h2>您好，</h2>
                <p>您正在注册{settings.MAIL_FROM_NAME}账户，验证码为：</p>
                <h1 style="color: #E11D48; letter-spacing: 5px;">{code}</h1>
                <p>验证码有效期为 <strong>5 分钟</strong>，请尽快完成注册。</p>
                <p>如果这不是您的操作，请忽略此邮件。</p>
                <hr>
                <p style="color: #666; font-size: 12px;">
                    {settings.MAIL_FROM_NAME}<br>
                    此邮件由系统自动发送，请勿回复
                </p>
            </body>
        </html>
        """
    else:  # reset
        subject = f"【{settings.MAIL_FROM_NAME}】重置密码验证码"
        body = f"""
        <html>
            <body>
                <h2>您好，</h2>
                <p>您正在重置{settings.MAIL_FROM_NAME}账户密码，验证码为：</p>
                <h1 style="color: #E11D48; letter-spacing: 5px;">{code}</h1>
                <p>验证码有效期为 <strong>5 分钟</strong>，请尽快完成密码重置。</p>
                <p style="color: #ff0000;">如果这不是您的操作，请立即修改密码并联系我们。</p>
                <hr>
                <p style="color: #666; font-size: 12px;">
                    {settings.MAIL_FROM_NAME}<br>
                    此邮件由系统自动发送，请勿回复
                </p>
            </body>
        </html>
        """
    
    message = MessageSchema(
        subject=subject,
        recipients=[email],
        body=body,
        subtype="html"
    )
    
    await fast_mail.send_message(message)

