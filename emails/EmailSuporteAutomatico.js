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
async function EmailSuporteAuto(email,nome,suporte) {
    const mailSent = await transporter.sendMail({
      text: 'Detectamos que você enfrentou algum problema em nossa plataforma, com isso, abrimos um chamado automático para você, em alguns estantes nosso equipe entrará em contato!',
      subject: 'Suporte Automático EDUKE',
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
                .divider {
                    width: 90%;
                    border-top: 2px solid #ffffff;
                    margin: 0px auto;
                    padding: 5px 0px;
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
                    font-size: 16px;
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
                                <h1>Seu Chamado</h1>
                                <p style="letter-spacing: 5px; text-transform: uppercase">#${suporte}</p>
                            </td>
                        </tr>
                    </table>
                    <div class="divider"></div>
                </div>
                <img src="https://imgs.aprendacomeduke.com.br/emails/chamadoEmail.png" alt="Banner de desculpas, estamos abrindo um chamado automatico" class="banner">
                <img src="https://imgs.aprendacomeduke.com.br/emails/desculpaEmail.png" alt="um cupom de desconto por ter passado por isso" class="banner">
                <p style="font-size: 18px; margin-top: 35px;">Segue o seu cupom: <span style="letter-spacing: 5px; text-transform: uppercase; font-weight: bolder;">${suporte+nome}</span><span></span></p>
                <span style="font-size: 13px;">Apenas você pode utilizar este cupom. Limitado a 1 (um) cupom por usuario e aplicável a 1 (uma) unidade de produto, com expiração de 12horas a partir do envio desse email.</span>
            </div>
        </body>
        </html>
      `,
    });
}
module.exports = {
    EmailSuporteAuto,
};