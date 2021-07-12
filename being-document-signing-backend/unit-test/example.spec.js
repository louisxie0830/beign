const PdfUtil = require("../src/libs/pdf-util");

describe("test", function() {
  it("styled certification", async () => {
    await PdfUtil.generatePDF();
  });
});
