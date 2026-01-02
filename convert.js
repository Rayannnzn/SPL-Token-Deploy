import bs58 from "bs58";
import fs from "fs";

const base58Key =
  "2VngN9w9p3seKjcwx4PhEpaDBPWGp2fy8xKzLAjmTZRuBvpeGsFpL1dZ3B82g9sCDbrXKnfuk8C3J5DD7UwXTzMZ";

const secretKey = bs58.decode(base58Key);

fs.writeFileSync("keypair.json", JSON.stringify([...secretKey]));
console.log("✅ keypair.json created");
