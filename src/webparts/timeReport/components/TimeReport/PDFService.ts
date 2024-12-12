import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as moment from 'moment';
import { PREFIX } from '~/config/database';
import { dateTimeFormat } from './constants';
import * as html2pdf from 'html2pdf.js';
import { BASE_URL_API_NET } from '~/config/constants';
import api from '~/services/api';

export default class PDFService {
  private leftImg;
  private rightImg;
  private centerImg;
  private items;
  private teamName;
  private programName;
  private language = {
    value: `${PREFIX}nome`,
    label: 'Português',
  };

  constructor(
    leftImg,
    rightImg,
    centerImg,
    items,
    teamName,
    programName,
    language
  ) {
    this.leftImg = leftImg;
    this.rightImg = rightImg;
    this.centerImg = centerImg;
    this.items = items;
    this.teamName = teamName;
    this.programName = programName;
    this.language = language;
  }

  public minifyHTML(template: string): string {
    return template
      .replace(/>\s+</g, '><')
      .replace(/\s{2,}/g, ' ')
      .replace(/<!--.*?-->/g, '')
      .trim();
  }

  public async generatePDF(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      const TITLE_TABLE = {
        
      }

      let htmlContent = `
      <html>
        <head>
          <style>
            body,
            * {
              font-family: arial;
            }
  
            #boxDay {
              background-color: #686868;
              height: 7.5mm;
              display: flex;
              align-items: center;
              position: relative;
              margin-left: -15mm;
              width: 45mm;
              justify-content: flex-end;
              border-bottom-right-radius: 20px;
              border-top-right-radius: 20px;
            }
  
            #section-day {
              margin: 3mm 10mm 3mm 10mm;            
              padding-top: .5rem;
              page-break-before: always;
            }
  
            #section-day:first-of-type {
              page-break-before: avoid;
            }
  
            .flex-between {
              display: flex;
              width: 100%;
              justify-content: space-between;
              align-items: center;
            }
  
            #boxDay p {
              font-size: 12pt;
              color: #fff;
              padding: 10px;
            }
  
            #timeBox {
              padding: 2mm;
              background-color: #686868;
              color: #fff;
              text-align: center;
              border-bottom-left-radius: 10px;
              border-top-left-radius: 10px;
            }
  
            .table-body {
              font-size: 9pt;
            }
  
            .row-body {
              break-inside: avoid;
              // page-break-before: always;
              // margin-top: 20mm;
            }
  
            .row-body > div {
              padding: 2mm;
            }
  
            .table-body .row-body > div {
              border-right: 5px solid #fff;
            }
  
            .table-body .row-body > div:nth-of-type(5) {
              border: none;
            }
  
            .table-head {
              border-bottom: 1px solid #000;
              margin-bottom: 2mm;
              width: 100%;
              display: flex;
            }
  
            .cell-head {
              text-align: start;
              font-weight: bold;
              padding: 2mm;
              /* margin-right: 5px; */
            }
  
            .table-head > div:nth-of-type(5) {
              border: 0;
            }
  
            .row-body {
              display: flex;
            }
  
            .table-body .row-body:nth-of-type(odd) {
              background-color: #f2f2f2;
              border-bottom-left-radius: 10px;
              border-top-left-radius: 10px;
            }
  
            .table-body .row-body:nth-of-type(even) {
              background-color: #fdfdfd;
              border-bottom-left-radius: 10px;
              border-top-left-radius: 10px;
            }
          </style>
        </head>
        <body>
  
          <div style="display: flex; align-items: center; height: 25mm; margin-left: 10mm; margin-top: -5mm;">
            <div style="width: 95mm;">
              <h1 style="font-size: 22px; font-weight: bold; margin: 0;">
                ${this?.programName}
              </h1>
            </div>
            <div style="display: flex; justify-content: space-between">
              <div style="background-image: url('${this?.leftImg}');width: 30mm;height: 5rem;background-position: center center;background-repeat: no-repeat no-repeat;background-size: contain;"> </div>
              <div style="background-image: url('${this?.centerImg}');width: 30mm;height: 5rem;background-position: center center;background-repeat: no-repeat no-repeat;background-size: contain;"> </div>
              <div style="background-image: url('${this?.rightImg}');width: 30mm;height: 5rem;background-position: center center;background-repeat: no-repeat no-repeat;background-size: contain;"> </div>
            </div>
          </div>
        `;

      htmlContent += `
        <div>
          ${this.items
            ?.map(
              (item) => `
              <div id="section-day">
                <div style="margin-top: 15px;" class='flex-between'>
                  <div id="boxDay">
                    <p>
                      ${item?.day}
                    </p>
                  </div>
                  <span>${item?.items?.[0]?.module}</span>
                </div>
  
                  <div style="overflow: hidden;display: flex;flex-direction: column;">
                    <div style="width: 100%">
                      <div class="table-head">
                        <div class="cell-head" style="width: 16mm">
                          Horário
                        </div>
                        <div class="cell-head" style="width: 30mm">Atividade</div>
                        <div class="cell-head" style="width: 60mm">Descrição</div>
                        <div class="cell-head" style="width: 27mm">Responsável</div>
                        <div class="cell-head" style="width: 45mm">Local</div>
                        <div class="cell-head" style="width: 2mm;padding:0;border:0"></div>
                      </div>
                      <div class="table-body">
                      ${item?.items
                        ?.map((row) => {
                          return `
                          <div class="row-body">
                            <div id="timeBox" style="width: 16mm">
                              <p>${row?.timeStart}</p>
                              <p>${row?.timeEnd}</p>
                            </div>
                            <div style="width: 30mm">${row?.name}</div>
                            <div style="width: 60mm">
                            <p style="text-decoration: underline;">${row?.course || ''}</p>
                            <p style="font-weight: bold;">${row.theme || ''}</p>
                              ${row?.documents
                                ?.map((doc) => `<p >${doc}</p>`)
                                .join('')}
                              
                              <p style="font-style: italic;">${
                                row.academicArea || ''
                              }</p>
                            </div>
                            <div style="font-style: italic;width: 27mm;">${
                              row.people || ''
                            }</div>
                            <div style="font-style: italic;width: 45mm;">${
                              row.spaces || ''
                            }</div>
                            <div style="background-color: #686868; width: 2mm;padding:0;border:0"></div>
                          </div>
                        `;
                        })
                        .join('')}
                      </div>
                    </div>
                  </div>
                </div>
              `
            )
            .join('')}
  
          <div style="display: flex; justify-content: flex-end; margin-top: 2rem; margin-right: 10mm;">
            <span style="font-size: 7pt; font-style: italic;">${moment().format(
              dateTimeFormat[this.language.value]
            )}</span>
          </div>
        </div>
        </body>
        </html>
      `;
      const { data } = await api.post(
        `${BASE_URL_API_NET}TimeReport`,
        { content: this.minifyHTML(htmlContent) },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          responseType: 'blob',
        }
      );
      const pdfBlob = new Blob([data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(pdfBlob);
      link.download = `${this.teamName}.pdf`;

      resolve();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
}
