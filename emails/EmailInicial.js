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
async function EnviarEmailInicial(email, nome) {
    const mailSent = await transporter.sendMail({
      text: 'Seja bem-vindo à plataforma EdukeCX2! Estamos muito felizes em tê-lo(a) conosco. Como uma plataforma de estudos inovadora, nossa missão é ajudá-lo(a) a alcançar seus objetivos educacionais de forma eficiente e personalizada. Caso tenha duvidas, não hesite em perguntar para a nossa equipe',
      subject: 'Boas Vindas ao EDUKE!',
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
                              <h1>Seja Bem Vindo(a)</h1>
                              <p>${nome}</p>
                          </td>
                      </tr>
                  </table>
                  <div class="divider"></div>
              </div>
              <a href="https://aprendacomeduke.com.br/" style="border: none; text-decoration: none;">
                  <img src="https://imgs.aprendacomeduke.com.br/emails/cadastroEmail.png" alt="Banner" class="banner">
              </a>
          </div>
      </body>
      </html>
      `,
    });
}
module.exports = {
    EnviarEmailInicial,
};