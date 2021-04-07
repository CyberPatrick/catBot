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
const empty_keyboard = {
  "inline_keyboard": [
    [

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
const bot = new TelegramBot(token, { webHook: { port: process.env.PORT, host: process.env.HOST } });
bot.setWebHook(`https://telegram-cat-bot.herokuapp.com:443/${token}`)
console.log('Bot started');

bot.on('callback_query', async cb => {
  let photo = await Photos.findOne({ photo_id: cb.data.slice(1) });
  if (!photo) {
    bot.answerCallbackQuery(cb.id, { text: 'Фото не найдено'});
  } else {
    if (cb.data[0] === 'y') {
      let author = photo.author_name ? `${photo.author_name} ${photo.author_last_name  ? photo.author_last_name : ''}` : 'Неизвестный';
      await bot.sendPhoto(channel_id, photo.file_id, { caption: `Прислал(а): ${author}` });
      bot.answerCallbackQuery(cb.id, { text: 'Фото опубликовано'});
      bot.sendMessage(photo.author_id, 'Ваша киска опубликована');
      bot.editMessageText('Фото опубликовано', { chat_id: cb.message.chat.id, message_id: cb.message.message_id, reply_markup: empty_keyboard  });
    } else {
      bot.answerCallbackQuery(cb.id, { text: 'Фото было удалено из БД' });
      bot.sendMessage(photo.author_id, 'Фото не прошло модерацию');
      bot.editMessageText('Фото отклонено', { chat_id: cb.message.chat.id, message_id: cb.message.message_id, reply_markup: empty_keyboard });
    }
    photo.remove();
  }
})

bot.on('message', async msg => {
  if (msg.photo) {
    let photo_id = random_id();
    let file_id = msg.photo[0].file_id;
    let author_id = msg.chat.id;
    let author_name = msg.from.first_name;
    let author_last_name = msg.from.last_name;
    let photo = new Photos({
      photo_id,
      file_id,
      author_id,
      author_name,
      author_last_name,
    });
    await photo.save();
    let keyboardCallback = Object.assign({}, keyboard);
    keyboardCallback.inline_keyboard[0][0].callback_data = 'y' + photo_id;
    keyboardCallback.inline_keyboard[0][1].callback_data = 'n' + photo_id;
    await bot.sendPhoto(boss_id, msg.photo[0].file_id);
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
