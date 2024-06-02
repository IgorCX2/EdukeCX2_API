const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "edukecx2@gmail.com",
      pass: "ovymmnxoprslxmfv",
    },
    tls: {
      rejectUnauthorized: false,
    },
});
async function EnviarEmailAlerta(email, tipoAlerta, codigoExterno) {
    /*
        0 = 3 Tentativas de acesso com senha incorreta
        1 = Voce podiu uma recuperação de senha
        2 = Voce esta acessando quando mandou uma solicitação para trocar a senha
        3 = Validar login
    */ 
   const descricao = ['[ALERTA] Você ou alguem bloqueio a sua conta, Parece que sua conta sofreu 3 tentativas de login, porem todas estavam erradas!','Ficamos sabendo que você perdeu/esqueceu a senha de nossa plataforma =( Não fique triste, eu mesmo vivo esquecendo as senhas, isso é normal =).Para resolvemos este problema é simples, basta clicar no botão abaixo, e colocar a sua nova senha! Viu como é fácil?','Percebemos que você solicitou uma recuperação de senha, mas parece que você acabou de acessar a plataforma sem concluir o processo de recuperação. Se você se lembrou da sua senha, tudo bem. Caso contrário, se você não foi você quem acessou, por favor, envie um e-mail para o nosso suporte para que possamos ajudá-lo(a) a garantir a segurança da sua conta',`${codigoExterno}.Você acaba de receber o número de validação de login, agora é só digitar este número no campo de validação`]
   const assuntoEmail = ['Bloqueio de conta', 'Recuperação de senha', 'Relembrou a senha?', 'Validar Login']
   const textoEmail = ['A sua conta foi Bloqueada por 3 minutos pois sofreu diversas tentativas de acesso com a senha incorreta','Ficamos sabendo que você perdeu/esqueceu a senha de nossa plataforma','Percebemos que você solicitou uma recuperação de senha, mas parece que você acabou de acessar a plataforma sem concluir o processo de recuperação.','Você acaba de receber o número de validação de login, agora é só digitar este número no campo de validação']
   const textoPequeno = ['caso seja você mesmo tentando realizar o login ignore esta mensagem, caso nao, troque a senha imediatamente!','Para resolvemos este problema é simples, basta clicar no botão abaixo, e colocar a sua nova senha! Viu como é fácil?','Se você se lembrou da sua senha, tudo bem. Caso contrário, se você não foi você quem acessou, por favor, envie um e-mail para o nosso suporte para que possamos ajudá-lo(a) a garantir a segurança da sua conta','Não se preocupe, isso é um medida de segurança comum, as vezes indentificamos alguma atividade incomum ou estamos verificando o seu email']
    const mailSent = await transporter.sendMail({
      text: descricao[tipoAlerta],
      subject: assuntoEmail[tipoAlerta],
      from: "Equipe CX2 <edukecx2@gmail.com>",
      to: email,
      html: `
      <!DOCTYPE html>
<html>
<head>
    <style>
        body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            text-align: center;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
        }
        .content-table {
            width: 100%;
            border-collapse: collapse;
        }
        .content-table td {
            padding: 10px;
        }
        .banner {
            width: 100%;
            height: auto;
        }
        .left-image {
            width: 140px;
            height: 65px;
            float: left;
        }
        .right-text {
            text-align: right;
            color: #333;
        }
        .right-text h1 {
            margin: 0;
            font-size: 20px;
        }
        .right-text p {
            margin: 5px 0 0;
            font-size: 16px;
            color: #4C62F4;
        }
        a span{
            font-size: 14px
        }
    </style>
</head>
<body>
    <div class="container">
        <div style="background-image: url('https://imgs.aprendacomeduke.com.br/emails/fundoEmailAzul.png');">
            <table class="content-table">
                <tr>
                    <td>
                        <img src="https://imgs.aprendacomeduke.com.br/logoTexto.png" alt="Logo CX2" class="left-image">
                    </td>
                    <td class="right-text">
                        <h1>ALERTA</h1>
                        <p style="letter-spacing: 5px; text-transform: uppercase">${assuntoEmail[tipoAlerta].split(' ')[0]}</p>
                    </td>
                </tr>
            </table>
        </div>
        <table style="padding: 10px 20px; text-align: center; margin-top: 35px;">
            <tr style="font-size: 18px;">
                <td>${textoEmail[tipoAlerta]}</td>
            </tr>
            <tr style="${tipoAlerta != 1 && tipoAlerta != 3 && "display:none"}">
                <td style="padding: 20px 0px">
                    ${tipoAlerta == 1 ? 
                        `<a href='http://localhost:3000/conta/recuperar/${codigoExterno}' style='text-decoration: none; color: #FFFFFF; background-color: #3B82F6; padding: 10px 40px; border-radius: 10px;'>TROCAR SENHA</a>`
                    : tipoAlerta == 3 &&
                    `<p style="letter-spacing: 10px; font-size: 32px; text-align: center; color:#3B82F6; text-transform: uppercase;">${codigoExterno.split("&")[2]}</p>` || ""
                    }
                </td>
            </tr>
            <tr>
                <td style="font-size: 13px;padding: 10px 0px;">${textoPequeno[tipoAlerta]}</td>
            </tr>
        </table>
        <img src="https://imgs.aprendacomeduke.com.br/emails/alertaEmail.png" alt="Sua segurançã e privacidade na internet é importante para a gente" class="banner">
        <div style="margin-top:-4px; background-image: url('https://imgs.aprendacomeduke.com.br/emails/fundoEmailAzul.png'); text-align: left; padding: 0 20px;">
            <a href="teste">• ultujjdoasjibdfydah<span>(teste)</span></a>
        </div>
    </div>
</body>
</html>
      `,
    });
}
module.exports = {
    EnviarEmailAlerta,
};