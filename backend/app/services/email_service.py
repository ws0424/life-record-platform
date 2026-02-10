from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from app.core.config import settings
from typing import List

# 163 邮箱配置 - 不使用 MAIL_FROM_NAME 避免被识别为诈骗
conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_FROM_NAME=None,  # 不设置发件人名称，避免 163 邮箱拒信
    MAIL_STARTTLS=False,  # 465 端口使用 SSL，不使用 STARTTLS
    MAIL_SSL_TLS=True,    # 启用 SSL
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=False  # 禁用证书验证（开发环境）
)

fast_mail = FastMail(conf)


async def send_verification_email(email: str, code: str, email_type: str) -> None:
    """发送验证码邮件"""
    if email_type == "register":
        subject = "注册验证码"
        body = f"""
        <html>
            <body>
                <h2>您好，</h2>
                <p>您正在注册账户，验证码为：</p>
                <h1 style="color: #E11D48; letter-spacing: 5px;">{code}</h1>
                <p>验证码有效期为 <strong>5 分钟</strong>，请尽快完成注册。</p>
                <p>如果这不是您的操作，请忽略此邮件。</p>
                <hr>
                <p style="color: #666; font-size: 12px;">
                    此邮件由系统自动发送，请勿回复
                </p>
            </body>
        </html>
        """
    else:  # reset
        subject = "重置密码验证码"
        body = f"""
        <html>
            <body>
                <h2>您好，</h2>
                <p>您正在重置账户密码，验证码为：</p>
                <h1 style="color: #E11D48; letter-spacing: 5px;">{code}</h1>
                <p>验证码有效期为 <strong>5 分钟</strong>，请尽快完成密码重置。</p>
                <p style="color: #ff0000;">如果这不是您的操作，请立即修改密码并联系我们。</p>
                <hr>
                <p style="color: #666; font-size: 12px;">
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

