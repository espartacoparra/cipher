const execSync = require('child_process').execSync;
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
var base = path.resolve('.');
const algorithm = 'aes-192-cbc';
const iv = Buffer.alloc(16, 0); // Initialization vector.
const inquirer = require('inquirer')

const Files = new class files {
 constructor() {
  this.dir = this.getDir()
  this.files = this.getFiles()
  this.key = ''
  this.option = ''
  this.operation()
 }
 getDir() {
  return fs.readdirSync(base)
 }
 getFiles() {
  let list = fs.readdirSync(base);
  return list.filter((file) => {
   if (fs.lstatSync(base + '/' + file).isFile() && file != 'main.js' && file != 'package-lock.json' && file != '.gitignore' && file != 'package.json') {
    return file
   }
  })
 }
 readFiles(data) {
  let file = ''
  if (this.option.value == 'C') {
   file = fs.readFileSync(base + '/' + data, 'utf8')
   let cryptoData = this.cryptoFile(file);
   this.writeFile(cryptoData, data);
  } else if (this.option.value == 'D') {
   file = fs.readFileSync(base + '/' + data, 'utf8')
   let decrypData = this.decrypFiles(file)
   this.writeFile(decrypData, data);
  }
 }

 writeFile(data, path) {
  fs.writeFileSync(base + '/' + path, data)
 }

 cryptoFile(data) {
  const cipher = crypto.createCipheriv(algorithm, this.key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted
 }

 decrypFiles(data) {
  try {
   const decipher = crypto.createDecipheriv(algorithm, this.key, iv);
   let decrypted = decipher.update(data, 'hex', 'utf8');
   decrypted += decipher.final('utf8');
   return decrypted
  } catch (error) {
  }
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
   this.cipher()
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




