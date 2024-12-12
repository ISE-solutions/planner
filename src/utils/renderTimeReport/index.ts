export default (html, css, leftImg, rightImg) => {
  return `
     <!DOCTYPE html>
     <html>
       <head>
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <style id="jss-server-side">
         @page { size: auto;  margin: 2.5mm; }
         ${css}
 
         #box-value {
           color: #A2A2A2;
           font-size: 14px;
         }
 
         #box-value > div > svg {
           visibility: hidden;
           display: none;
         }
 
         #box-only-value > svg {
           visibility: hidden;
           display: none;
         }
         
         </style>
       </head>
       <body style="font-family: roboto !important;">
      
       <div style="display: flex;align-items: center; justify-content: space-between;">
       
        ${
          leftImg
            ? `<img 
        style="width: 30%"
        src="${leftImg}"
        alt="Logo Empresa" />`
            : '</div>'
        }
       
        ${
          rightImg
            ? `<img 
        style="width: 30%"
        src="${rightImg}"
        alt="Logo Empresa" />`
            : '</div>'
        }
         
        </div>

        <h3 style="font-weight: bold; font-size: 18px; text-align: center" class="MuiTypography-root MuiTypography-body1"> Relatório de Horário </h3>

         <div id="root">${html}</div>
       </body>
     </html>
   `;
};
