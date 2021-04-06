const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const Photos = require('./models/photo');
const token = `${process.env.TOKEN}`;
const boss_id = 949930616;
const channel_id = '@Thehottest_cats'
const keyboard = {
  "inline_keyboard": [
    [
      { "text": 'Да' , "callback_data": '' },
      { "text": 'Нет' , "callback_data": '' }
    ]
  ]
}


async function main() {
async function start() {
  try {
    await mongoose.connect(`mongodb+srv://Nikita:${process.env.PASSWORD}@cluster0.onow1.mongodb.net/myFirstDatabase`, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    console.log('Connected to database');
  } catch (err) {
    console.log(err);
    process.exit();
  }
}


await start();
const bot = new TelegramBot(token, { polling: true, webhook: { port: prcocess.env.PORT, host: process.env.HOST } });
console.log('Bot started');

bot.on('callback_query', async cb => {
  let photo = await Photos.findOne({ photo_id: cb.data.slice(1) });
  if (!photo) {
    bot.answerCallbackQuery(cb.id, { text: 'Фото не найдено'});
  } else {
    if (cb.data[0] === 'y') {
      bot.sendPhoto(channel_id, photo.file_id);
      bot.answerCallbackQuery(cb.id, { text: 'Фото опубликовано'});
      bot.sendMessage(photo.author_id, 'Ваша киска опубликована');
    } else {
      bot.answerCallbackQuery(cb.id, { text: 'Фото было удалено из БД' });
      bot.sendMessage(photo.author_id, 'Фото не прошло модерацию');
    }
    photo.remove();
  }
})

bot.on('message', async msg => {
  if (msg.photo) {
    let photo_id = random_id();
    let file_id = msg.photo[0].file_id;
    let author_id = msg.chat.id;
    let photo = new Photos({
      photo_id,
      file_id,
      author_id,
    });
    await photo.save();
    let keyboardCallback = Object.assign({}, keyboard);
    keyboardCallback.inline_keyboard[0][0].callback_data = 'y' + photo_id;
    keyboardCallback.inline_keyboard[0][1].callback_data = 'n' + photo_id;
    bot.sendPhoto(boss_id, msg.photo[0].file_id);
    bot.sendMessage(boss_id, 'Опубликовать?', { reply_markup: keyboard });
  } else {
    bot.sendMessage(msg.chat.id, 'Вы не отправили картинку киски.')
  }
})


function random_id () {
  return Math.floor(Math.random() * 1000000).toString();
}
}

main();
