const { type } = require('os');

const execSync = require('child_process').execSync;
const crypto = require("crypto")
const fs = require('fs')
const path = require('path')
var base = path.resolve('.');
const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
const key = crypto.scryptSync(password, 'salt', 24);
const iv = Buffer.alloc(16, 0); // Initialization vector.
console.log(base);
const inquirer = require('inquirer')




const Files = new class files {
 constructor() {
  this.dir = this.getDir()
  this.files = this.getFiles()
  this.key = ""
  this.option = ""
  this.operation()
  //this.cipher()
 }
 getDir() {
  return fs.readdirSync(base)
 }
 getFiles() {
  let list = fs.readdirSync(base);
  return list.filter((file) => {
   console.log(base + '/' + file, fs.lstatSync(base + '/' + file).isFile());
   if (fs.lstatSync(base + '/' + file).isFile() && file != 'main.js' && file != "package-lock.json") {
    return file
   }
  })
 }
 readFiles(data) {

  if (this.option.value == "C") {
   let file = fs.readFileSync(base + "/" + data, 'utf8')
   let cryptoData = this.cryptoFile(file);
   this.writeFile(cryptoData, data);
  } else if (this.option.value == "D") {
   let file = fs.readFileSync(base + "/" + data, 'utf8')
   let decrypData = this.decrypFiles(file)
   console.log(file);
   this.writeFile(decrypData, data);
  }
 }

 writeFile(data, path) {
  fs.writeFileSync(base + "/" + path, data)
 }

 cryptoFile(data) {
  console.log(this.key, '++++++++++++');
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  console.log(encrypted);
  return encrypted
 }

 decrypFiles(data) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(data, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  console.log(decrypted);
  return decrypted
 }

 cipher() {
  this.files.map((file) => {
   this.readFiles(file);
  })
 }

 async operation() {
  try {
   this.option = await this.questions('para cifrar C, para Decifrar D');
   let password = await this.questions('Ingrese du clave');
   this.key = crypto.scryptSync(password.value, 'salt', 24)
   console.log(this.key);
   this.cipher()
   console.log(this.option);

  } catch (error) {
   console.log(error);

  }

 }

 async questions(message) {
  var questions = [{
   type: 'input',
   name: 'value',
   message: message,
  }]
  return await inquirer.prompt(questions)
 }

}




