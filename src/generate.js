const { bold, green, red } = require('chalk');
const fs = require('fs');
const mm = require('music-metadata');

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) await callback(array[index], index, array);
}

module.exports = async outputTo => {
  const data = [];
  const parsingError = [];

  await asyncForEach(fs.readdirSync('.'), async file => {
    if (fs.lstatSync(file).isDirectory()) return;

    try {
      const metaData = await mm.parseFile(file);

      const generatedString = `${('0' + metaData.common.track.no).slice(-2)}. ${
        metaData.common.title
      } (${Math.floor(metaData.format.duration / 60)}:${(
        '0' + Math.floor(metaData.format.duration % 60)
      ).slice(-2)})`;

      data.push({ track: metaData.common.track.no, generatedString: generatedString });
    } catch (e) {
      parsingError.push(file);
    }
  });

  data.sort((a, b) => {
    if (a.track < b.track) return -1;
    if (a.track == b.track) return 0;
    if (a.track > b.track) return 1;
  });

  data.forEach(el => console.log(`${bold(el.generatedString)}`));

  if (outputTo !== undefined && outputTo != '' && data.length > 0) {
    let output = '';
    data.forEach(el => (output += el.generatedString + '\n'));
    fs.writeFileSync(outputTo, output);
    console.log(green(`\n* The output has been successfully written to ${outputTo}.`));
  }

  if (parsingError.length > 0 || data.length == 0) {
    console.log(`\n${red('* Error(s):')}`);
    if (data.length == 0) console.log('   No audio files were found.');
    parsingError.forEach(file => console.log(`   Cannot parse ${file}.`));
  }
};
