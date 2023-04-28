function codigo_pix(pix_key,destinatario,city,descr,value){

  //fonte: https://www.bcb.gov.br/content/estabilidadefinanceira/spb_docs/ManualBRCode.pdf

  const payload_format = '000201';
  const merchant_account = '0014BR.GOV.BCB.PIX';
  const pix_information = '01'+pix_key.length.toString().padStart(2,'0')+pix_key;
  const account_and_pix = '26'+(merchant_account+pix_information).length.toString().padStart(2,'0')+merchant_account+pix_information
  const merchant_category_code = '52040000';
  const transaction_currency = '5303986';
  const transaction_ammount = '54'+value.length.toString().padStart(2,'0')+value;
  const country_code = '5802BR';
  const merchant_name = '59'+destinatario.length.toString().padStart(2,'0')+destinatario;
  const merchant_city = '60'+city.length.toString().padStart(2,'0')+city;
  const additional_data_field = '62'+('05'+descr.length.toString().padStart(2,'0')+descr).length.toString().padStart(2,'0')+('05'+descr.length.toString().padStart(2,'0')+descr);
  const crc16_prefix = '6304';

  return payload_format+account_and_pix+merchant_category_code+transaction_currency+transaction_ammount+country_code+merchant_name+merchant_city+additional_data_field+crc16_prefix;

}

function crc_ccitt_ffff(str) {
  
  //fonte: https://stackoverflow.com/questions/68243628/calculate-crc16-ccitt-false-in-google-apps-script
  
  if (str == '') return;

  const get_crc_for_num = (n) => {
    let crc = 0;
    let c = n * 256;
    [...Array(8).keys()].forEach(_ => {
      crc = ((crc ^ c) & 0x8000) ? (crc * 2) ^ 0x1021 : crc * 2;
      c = c * 2;
    });
    return crc;
  }

  const table = [...Array(256).keys()].map((_,n) => get_crc_for_num(n));

  var crc = 0xFFFF;

  str.split('').forEach(c => {
    crc = (crc * 0x100) ^ table[(((crc / 0x100) >> 0) ^ c.charCodeAt()) & 0xFF];
    crc = (((crc / 0x10000) >> 0) * 0x10000) ^ crc; 
  });

  return crc.toString(16).toUpperCase();

}

function main() {

  var chave = '12345678900';      //podem ser quaisquer das chaves.... em caso de ser o celular, usar '+55DDNNNNNNNNN'
  var destinatario = 'Joao Pe de Feijao'.slice(0,25);  //texto limitado a 25 caracteres com o nome da pessoa, apenas para aparecer na string final. o que vale mesmo é a chave.
  var cidade = 'Niteroi-RJ';    //texto para aparecer na string final
  var descr_pix = 'despesas futeis'   //texto para aparecer na string final
  var valor = '0.99';  // decimal usando ponto


  console.log(codigo_pix(chave,destinatario,cidade,descr_pix,valor)+crc_ccitt_ffff(codigo_pix(chave,destinatario,cidade,descr_pix,valor)););


  // para validar, usei este PIX-decoder >>> https://pix.nascent.com.br/tools/pix-qr-decoder/

}
