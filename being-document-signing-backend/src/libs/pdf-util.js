const Exiftool = require("node-exiftool");
const HummusRecipe = require("hummus-recipe");
const Fs = require("fs");
const PngUtil = require("./png-util");
const Uuidv4 = require("uuid/v4");
const Path = require("path");
const Puppeteer = require("puppeteer");
module.exports = {
  generateCertificationFile2: async (id, filePath) => {
    const browser = await Puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--headless",
        "--disable-gpu",
        "--disable-dev-shm-usage"
      ]
    });
    const page = await browser.newPage();
    await page.emulateMedia("screen");
    await page.goto(
      "http://127.0.0.1:8080/letter/certification/info?id=" + id,
      {
        waitUntil: "networkidle2"
      }
    );
    let height = await page.evaluate(
      () => document.documentElement.offsetHeight
    );
    await page.pdf({
      path: filePath,
      printBackground: true,
      margin: "none",
      width: 1270,
      height: height + 20
    });
    await browser.close();
  },
  generateCertificationFile: async (
    filePath,
    language,
    {
      documentId,
      documentName,
      completedAt,
      creator,
      createdAt,
      receiverList,
      fileList
    }
  ) => {
    const pdfDoc = new HummusRecipe("new", filePath, {
      version: 1.6,
      author: "beingsign.com",
      title: "Certification",
      subject: "Certification by BeingSign",
      fontSrcPath: Path.join(__dirname, "../../fonts")
    });
    const width = 612;
    // const height = 792;
    const textOpts = {
      font: "PMingLiU",
      color: [0, 0, 0]
    };
    if (language === "zh_tw") {
      pdfDoc
        .createPage("Certification")
        .text("簽署認証資訊", width / 2 - 20, 20, textOpts)
        .text(`文件編號: ${documentId}`, 20, 40, textOpts)
        .text(`文件標題: ${documentName}`, 20, 60, textOpts)
        .text(`完成簽署時間: ${completedAt}`, 20, 80, textOpts)
        .text(`發起人: ${creator}`, 20, 100, textOpts)
        .text(`發起時間: ${createdAt}`, 20, 120, textOpts);
      let h = 120;
      receiverList.map(({ name, time, type }) => {
        h += 20;
        if (type === 1) {
          pdfDoc.text("簽署人:", 20, h, textOpts);
        } else {
          pdfDoc.text("同意人:", 20, h, textOpts);
        }
        h += 20;
        pdfDoc.text(`${name}/${time}`, 40, h, textOpts);
      });
      h += 20;
      pdfDoc.text("BeingSign document id(s):", 20, h, textOpts);
      fileList.map(file => {
        h += 20;
        pdfDoc.text(`${file.uuid}`, 40, h, textOpts);
      });
      pdfDoc
        .image(Path.join(__dirname, "../../static/logo.png"), width - 70, h, {
          width: 50,
          height: 50
        })
        .endPage()
        .endPDF();
    } else if (language === "zh_cn") {
      pdfDoc
        .createPage("Certification")
        .text("签署认证资讯", width / 2 - 20, 20, textOpts)
        .text(`文件编号: ${documentId}`, 20, 40, textOpts)
        .text(`文件标题: ${documentName}`, 20, 60, textOpts)
        .text(`完成签署时间: ${completedAt}`, 20, 80, textOpts)
        .text(`发起人: ${creator}`, 20, 100, textOpts)
        .text(`发起时间: ${createdAt}`, 20, 120, textOpts);
      let h = 120;
      receiverList.map(({ name, time, type }) => {
        h += 20;
        if (type === 1) {
          pdfDoc.text("签署人:", 20, h, textOpts);
        } else {
          pdfDoc.text("同意人:", 20, h, textOpts);
        }
        h += 20;
        pdfDoc.text(`${name}/${time}`, 40, h, textOpts);
      });
      h += 20;
      pdfDoc.text("BeingSign document id(s):", 20, h, textOpts);
      fileList.map(file => {
        h += 20;
        pdfDoc.text(`${file.uuid}`, 40, h, textOpts);
      });
      pdfDoc
        .image(Path.join(__dirname, "../../static/logo.png"), width - 70, h, {
          width: 30,
          height: 30
        })
        .endPage()
        .endPDF();
    } else {
      pdfDoc
        .createPage("Certification")
        .text("Certification", width / 2 - 20, 20, textOpts)
        .text(`File ID: ${documentId}`, 20, 40, textOpts)
        .text(`File Name: ${documentName}`, 20, 60, textOpts)
        .text(`Sign Date: ${completedAt}`, 20, 80, textOpts)
        .text(`Creator: ${creator}`, 20, 100, textOpts)
        .text(`Create Date: ${createdAt}`, 20, 120, textOpts);
      let h = 120;
      receiverList.map(({ name, time, type }) => {
        h += 20;
        if (type === 1) {
          pdfDoc.text("Signer:", 20, h, textOpts);
        } else {
          pdfDoc.text("Approver:", 20, h, textOpts);
        }
        h += 20;
        pdfDoc.text(`${name}/${time}`, 40, h, textOpts);
      });
      h += 20;
      pdfDoc.text("BeingSign document id(s):", 20, h, textOpts);
      fileList.map(file => {
        h += 20;
        pdfDoc.text(`${file.uuid}`, 40, h, textOpts);
      });
      pdfDoc
        .image(Path.join(__dirname, "../../static/logo.png"), width - 70, h, {
          width: 50,
          height: 50
        })
        .endPage()
        .endPDF();
    }
  },
  getMetadata: (file, keys) => {
    return new Promise((resolve, reject) => {
      const ep = new Exiftool.ExiftoolProcess();
      ep.on(Exiftool.events.OPEN, pid => {
        console.log("Started exiftool process %s", pid);
      });
      let metas = null;
      ep.open()
        // read and write metadata operations
        .then(() => ep.readMetadata(file))
        .then(data => {
          if (data.error == null) {
            metas = data.data[0];
          } else {
            console.log("data has error", data);
          }
        })
        .then(() => ep.close())
        .then(() => {
          if (metas) {
            console.log("readingMetadata", metas);
            const result = {};
            keys.forEach(key => {
              result[key] = metas[key];
            });
            resolve(result);
          } else {
            resolve(null);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  setMetadata: async (file, object) => {
    return new Promise((resolve, reject) => {
      const ep = new Exiftool.ExiftoolProcess();
      ep.open()
        .then(() => {
          const params = { all: "" };
          Object.keys(object).map(key => {
            const actualKey = `XMP-pdfx:${key}`;
            params[actualKey] = object[key];
          });
          console.log("settingMetadata", params);
          return ep.writeMetadata(file, params, ["overwrite_original"]);
        })
        .then(() => ep.close())
        .then(() => {
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  addEStamp: async (file, outFile, signatures, images) => {
    const pdfDoc = new HummusRecipe(file, outFile);
    const pages = pdfDoc.metadata.pages;
    const width = pdfDoc.metadata[pages].width;
    const height = pdfDoc.metadata[pages].height;
    try {
      for (var i = 0; i < pages; i++) {
        pdfDoc.editPage(i + 1);
        if (i + 1 == pages && signatures && signatures.length >= 0) {
          let bottom = 5;
          let currImagesLength = 10;
          let maxHeight = 0;
          signatures.forEach(s => {
            const url = `/tmp/${Uuidv4()}.png`;
            const png = PngUtil.textToPng(s);
            if (png.height > maxHeight) {
              maxHeight = png.height;
            }
            if (currImagesLength + png.width >= width - 40) {
              bottom += maxHeight + 5;
              currImagesLength = 10;
            }
            Fs.writeFileSync(url, png.buffer);
            pdfDoc.image(url, currImagesLength, height - png.height - bottom, {
              width: png.width,
              height: png.height
            });
            currImagesLength += png.width + 10;
          });
        }
        if (images && images.find(image => image.pageNo === i + 1)) {
          for (var j = 0; j < images.length; j++) {
            const s = images[j];
            if (s.pageNo === i + 1) {
              const url = `/tmp/${Uuidv4()}.png`;
              await PngUtil.base64ToFile(url, s.pngContent);
              pdfDoc.image(url, s.positionX, s.positionY, {
                keepAspectRatio: true,
                scale: 0.5
              });
            }
          }
        }
        pdfDoc.endPage();
      }
    } catch (e) {
      console.log(e.message);
    }
    pdfDoc.endPDF();
  },
  addWatermark: (file, outfile, text) => {
    const pdfDoc = new HummusRecipe(file, outfile);
    const pages = pdfDoc.metadata.pages;
    for (let i = 1; i <= pages; i++) {
      const width = pdfDoc.metadata[i].width;
      const height = pdfDoc.metadata[i].height;
      try {
        pdfDoc.editPage(i);
        for (let j = 0; j < width; j += 200) {
          for (let k = 0; k < height; k += 200) {
            pdfDoc.text(text, j, k, {
              color: "066099",
              fontSize: 30,
              bold: true,
              font: "Helvatica",
              align: "center center",
              opacity: 0.08,
              rotation: -30
            });
          }
        }
        pdfDoc.endPage();
      } catch (e) {
        console.error(e.message);
      }
    }
    pdfDoc.endPDF();
  },
  addDocumentId: (file, outfile, text) => {
    const pdfDoc = new HummusRecipe(file, outfile);
    const pages = pdfDoc.metadata.pages;
    for (let i = 1; i <= pages; i++) {
      try {
        pdfDoc.editPage(i);
        pdfDoc.text(text, 8, 8, {
          fontSize: 8,
          font: "Helvatica",
          color: "333333"
        });
        pdfDoc.endPage();
      } catch (e) {
        console.log(e.message);
      }
    }
    pdfDoc.endPDF();
  }
};
