document.addEventListener('DOMContentLoaded', () => {
  // اختيار عناصر الإدخال والزر
  const yearInput = document.querySelector('#inputs input:nth-child(1)');
  const monthInput = document.querySelector('#inputs input:nth-child(2)');
  const dayInput = document.querySelector('#inputs input:nth-child(3)');
  const button = document.querySelector('#button');

  // اختيار عناصر النافذة المنبثقة
  const popup = document.querySelector('#popup');       
  const resultDays = document.querySelector('#result-days');     
  const resultZodiac = document.querySelector('#result-zodiac'); 
  const resultInfo = document.querySelector('#result-info');     
  const close = document.querySelector('#close');       

  let zodiacData = [];

  // تحميل بيانات الأبراج من ملف JSON
  fetch('Borg.json')
    .then(response => response.json())
    .then(data => {
      zodiacData = data;
    })
    .catch(error => console.error('خطأ في تحميل بيانات الأبراج:', error));

  // دالة لايجاد البرج بناءً على اليوم والشهر
  function getZodiac(day, month) {
    for (let zodiac of zodiacData) {
      const startMonth = zodiac.start.month;
      const startDay = zodiac.start.day;
      const endMonth = zodiac.end.month;
      const endDay = zodiac.end.day;

      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay) ||
        (startMonth > endMonth && ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)))
      ) {
        return zodiac;
      }
    }
    return null;
  }

  // عند الضغط على زر "احسب"
  button.addEventListener('click', (e) => {
    e.preventDefault();

    const year = parseInt(yearInput.value);
    const month = parseInt(monthInput.value);
    const day = parseInt(dayInput.value);

    // تحقق من صحة الإدخال
    if (!year || !month || !day || month < 1 || month > 12 || day < 1 || day > 31) {
      resultDays.textContent = 'ادخل تاريخك كامل وبشكل صحيح!';
      resultZodiac.textContent = '';
      resultInfo.textContent = '';
      popup.classList.add('show');
      return;
    }

    // التحقق من عدد أيام كل شهر (مع السنة الكبيسة)
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) {
      resultDays.textContent = `الشهر ${month} لا يحتوي على ${day} يومًا!`;
      resultZodiac.textContent = '';
      resultInfo.textContent = '';
      popup.classList.add('show');
      return;
    }

    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    const diffTime = today - birthDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    
     let current = 0;
const increment = Math.ceil(diffDays / 100);
const interval = setInterval(() => {
  current += increment;
  if (current >= diffDays) {
    current = diffDays;
    clearInterval(interval);
  }
  resultDays.innerHTML = `لقد عشت ${current} يومًا وما زلت واقفًا<br>👏👏👏`;
}, 10);




    const zodiac = getZodiac(day, month);
    if (zodiac) {
      resultZodiac.textContent = `${zodiac.name} ${zodiac.emoji}`;
      resultInfo.textContent = zodiac.info;
    } else {
      resultZodiac.textContent = '';
      resultInfo.textContent = '';
    }

    popup.classList.add('show');
  });

  // إغلاق النافذة عند الضغط على زر ×
  close.addEventListener('click', () => {
    popup.classList.remove('show');
  });

  // إغلاق عند الضغط خارج صندوق المحتوى
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.classList.remove('show');
    }
  });
});