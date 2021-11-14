import { FileWriter, Reader } from "wav";
import { createReadStream, createWriteStream, existsSync } from "fs";

const inputFile = process.argv.find((x) => x.startsWith("ifile="))?.replace("ifile=", "");
const outputFile = process.argv.find((x) => x.startsWith("ofile="))?.replace("ofile=", "");
const mode = process.argv.find((x) => x.startsWith("mode="))?.replace("mode=", "");

const argsSpecified = inputFile && outputFile;

const encode = (inputFile: string, outputFile: string) => {
  console.log(`Encoding: ${inputFile}`);
  const fileInput = createReadStream(inputFile);
  const fileOutput = new FileWriter(outputFile);

  fileInput.pipe(fileOutput);
  fileInput.resume();

  fileInput.on("exit", () => process.exit(0));
};

const decode = (inputFile: string, outputFile: string) => {
  console.log(`Decoding: ${inputFile}`);
  const fileInput = createReadStream(inputFile);
  const fileOutput = createWriteStream(outputFile);
  const reader = new Reader();

  reader.on("format", () => {
    reader.pipe(fileOutput);
    reader.resume();
  });

  reader.on("exit", () => process.exit(0));

  fileInput.pipe(reader);
};

if (!argsSpecified) {
  console.error("input or output file not specified! Use ifile= and ofile= args");
  process.exit(1);
}

if (!existsSync(inputFile)) {
  console.error("input file doesn't exist or inaccessible");
  process.exit(1);
}

mode === "decode" ? decode(inputFile, outputFile) : encode(inputFile, outputFile);
