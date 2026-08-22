document.addEventListener('DOMContentLoaded', () => {

const FIELDS = {
    academic: ['health', 'engineering-tech', 'business', 'languages-humanities'],
    vocational: ['voc-it', 'voc-design', 'voc-hospitality', 'voc-admin', 'voc-construction', 'voc-agriculture', 'voc-healthcare', 'voc-sports', 'voc-crafts', 'voc-logistics', 'voc-manufacturing', 'voc-social']
};

const FIELD_LABELS = {
    'health': 'صحي',
    'engineering-tech': 'هندسي وعلوم وتكنولوجيا',
    'business': 'أعمال',
    'languages-humanities': 'لغات وعلوم إنسانية',
    'voc-it': 'تقنية المعلومات',
    'voc-design': 'التصميم والوسائط',
    'voc-hospitality': 'الضيافة والعناية',
    'voc-admin': 'الإدارة والسياحة',
    'voc-construction': 'الإنشاءات والميكانيكا',
    'voc-agriculture': 'الزراعة والبيئة',
    'voc-healthcare': 'الرعاية الصحية',
    'voc-sports': 'الرياضة واللياقة',
    'voc-crafts': 'الفنون والحرف',
    'voc-logistics': 'الخدمات اللوجستية',
    'voc-manufacturing': 'التصنيع والتكنولوجيا',
    'voc-social': 'التعليم والعمل المجتمعي'
};

const PATH_LABELS = {
    academic: 'أكاديمي',
    vocational: 'مهني'
};

const questions = [
    {
        text: 'عند مواجهة مشكلة جديدة، كيف تتعامل معها؟',
        weight: 2,
        answers: [
            { text: 'أحلل البيانات وأقسمها لمراحل منطقية', scores: { 'engineering-tech': 3, 'voc-it': 2, 'voc-manufacturing': 2 } },
            { text: 'أبحث عن حل مبتكر أو فني غير تقليدي', scores: { 'languages-humanities': 2, 'voc-design': 3, 'voc-crafts': 2 } },
            { text: 'أركز على تأثير الحل على صحة أو راحة الآخرين', scores: { health: 3, 'voc-healthcare': 3, 'voc-social': 1 } },
            { text: 'أضع خطة تنفيذية وأوزع المهام بفعالية', scores: { business: 3, 'voc-admin': 3, 'voc-logistics': 1 } },
            { text: 'أجرب أدوات عملية بيدي لأصلح أو أبني', scores: { 'engineering-tech': 2, 'voc-construction': 3, 'voc-manufacturing': 2 } },
            { text: 'أراعي التوازن البيئي والصحي المستدام', scores: { health: 2, 'voc-agriculture': 3, 'voc-sports': 1 } }
        ]
    },
    {
        text: 'ما النشاط الذي يشحن طاقتك ويجعلك تشعر بالإنجاز؟',
        weight: 2,
        answers: [
            { text: 'برمجة، تحليل أرقام، أو حل معادلات معقدة', scores: { 'engineering-tech': 3, 'voc-it': 3 } },
            { text: 'رسم، كتابة، أو إنتاج محتوى مرئي مؤثر', scores: { 'languages-humanities': 3, 'voc-design': 3, 'voc-crafts': 2 } },
            { text: 'مساعدة شخص مريض أو دعم نفسيته', scores: { health: 3, 'voc-healthcare': 3 } },
            { text: 'تنظيم حدث أو إدارة فريق لتحقيق هدف مشترك', scores: { business: 3, 'voc-admin': 3 } },
            { text: 'التمارين الرياضية، التدريب، أو المنافسة', scores: { health: 2, 'voc-sports': 3 } },
            { text: 'العناية بنباتات، حيوانات، أو مشاريع خضراء', scores: { health: 2, 'voc-agriculture': 3 } }
        ]
    },
    {
        text: 'أي بيئة عمل تشعر فيها بالراحة والإنتاجية؟',
        weight: 1,
        answers: [
            { text: 'مختبرات، ورش تقنية، أو مكاتب بحثية', scores: { 'engineering-tech': 3, 'voc-manufacturing': 2 } },
            { text: 'استوديوهات فنية، مسرح، أو فضاءات إبداعية', scores: { 'languages-humanities': 3, 'voc-design': 3 } },
            { text: 'مستشفيات، عيادات، أو مراكز رعاية', scores: { health: 3, 'voc-healthcare': 3 } },
            { text: 'قاعات اجتماعات، فنادق، أو مكاتب إدارية', scores: { business: 3, 'voc-admin': 2, 'voc-hospitality': 2 } },
            { text: 'ملاعب، صالات رياضية، أو هواء طلق', scores: { health: 2, 'voc-sports': 3 } },
            { text: 'مواقع بناء، حقول، أو ورش صيانة ميدانية', scores: { 'engineering-tech': 2, 'voc-construction': 3, 'voc-agriculture': 2 } }
        ]
    },
    {
        text: 'كيف تفضل تعلم مهارة جديدة؟',
        weight: 1,
        answers: [
            { text: 'فهم القواعد النظرية ثم التطبيق العملي المنظم', scores: { 'engineering-tech': 3, 'voc-it': 2 } },
            { text: 'مشاهدة نماذج ملهمة والتجربة بالخطأ والصواب', scores: { 'languages-humanities': 2, 'voc-design': 3, 'voc-crafts': 2 } },
            { text: 'التدريب تحت إشراف مختص صحي أو تربوي', scores: { health: 3, 'voc-healthcare': 3, 'voc-social': 2 } },
            { text: 'وضع أهداف زمنية ومعايير قياس واضحة', scores: { business: 3, 'voc-admin': 3, 'voc-logistics': 2 } },
            { text: 'الممارسة الحركية أو البدنية المتكررة', scores: { health: 2, 'voc-sports': 3, 'voc-construction': 2 } },
            { text: 'الانخراط في مشروع بيئي أو مجتمعي واقعي', scores: { health: 2, 'voc-agriculture': 3, 'voc-social': 2 } }
        ]
    },
    {
        text: 'عند القيادة أو العمل ضمن فريق، ما دورك التلقائي؟',
        weight: 2,
        answers: [
            { text: 'أقدم التحليلات التقنية وأضمن دقة التنفيذ', scores: { 'engineering-tech': 3, 'voc-manufacturing': 2, 'voc-it': 2 } },
            { text: 'أصمم الواجهات، المحتوى، أو الهوية البصرية', scores: { 'languages-humanities': 3, 'voc-design': 3 } },
            { text: 'أراقب الحالة النفسية والجسدية للفريق', scores: { health: 3, 'voc-healthcare': 2, 'voc-social': 3 } },
            { text: 'أنسق الجداول، الميزانيات، والموارد', scores: { business: 3, 'voc-admin': 3 } },
            { text: 'أشرف على التنفيذ الميداني والجودة العملية', scores: { 'engineering-tech': 2, 'voc-construction': 3, 'voc-logistics': 2 } },
            { text: 'أضمن الاستدامة البيئية أو اللياقة البدنية', scores: { health: 2, 'voc-agriculture': 2, 'voc-sports': 3 } }
        ]
    },
    {
        text: 'ما القوة التي تثق بها في شخصيتك؟',
        weight: 2,
        answers: [
            { text: 'الدقة المنطقية والقدرة على الربط التقني', scores: { 'engineering-tech': 3, 'voc-it': 3 } },
            { text: 'الخيال الواسع والتعبير الفني', scores: { 'languages-humanities': 3, 'voc-design': 3, 'voc-crafts': 2 } },
            { text: 'التعاطف والقدرة على العناية بالآخرين', scores: { health: 3, 'voc-healthcare': 3, 'voc-social': 2 } },
            { text: 'الطموح التنظيمي والقدرة على الإقناع', scores: { business: 3, 'voc-admin': 3, 'voc-logistics': 1 } },
            { text: 'الصبر والمهارة اليدوية أو البدنية', scores: { 'engineering-tech': 2, 'voc-construction': 2, 'voc-sports': 3 } },
            { text: 'التوازن والانسجام مع الطبيعة والصحة', scores: { health: 3, 'voc-agriculture': 3, 'voc-manufacturing': 1 } }
        ]
    },
    {
        text: 'أي محتوى يجذب انتباهك تلقائياً؟',
        weight: 1,
        answers: [
            { text: 'أبحاث علمية، تقنيات حديثة، أو برمجة', scores: { 'engineering-tech': 3, 'voc-it': 2, 'voc-manufacturing': 2 } },
            { text: 'أدب، فلسفة، فنون، أو سينما', scores: { 'languages-humanities': 3, 'voc-design': 2, 'voc-crafts': 2 } },
            { text: 'قصص إنسانية، صحة نفسية، أو طب وقائي', scores: { health: 3, 'voc-healthcare': 3, 'voc-social': 2 } },
            { text: 'ريادة أعمال، تسويق، أو دراسات إدارية', scores: { business: 3, 'voc-admin': 2, 'voc-logistics': 2 } },
            { text: 'وثائقيات عن البناء، الآلات، أو الرياضة', scores: { 'engineering-tech': 2, 'voc-construction': 2, 'voc-sports': 3 } },
            { text: 'مشاريع خضراء، زراعة، أو حياة صحية', scores: { health: 2, 'voc-agriculture': 3 } }
        ]
    },
    {
        text: 'كيف تتخذ قرارات مصيرية؟',
        weight: 1,
        answers: [
            { text: 'أعتمد على المعطيات المنطقية والاحتمالات', scores: { 'engineering-tech': 3, 'voc-manufacturing': 2 } },
            { text: 'أستند إلى الحدس والقيم الإنسانية', scores: { 'languages-humanities': 3, 'voc-social': 3 } },
            { text: 'أراعي الجانب الصحي والسلامة أولاً', scores: { health: 3, 'voc-healthcare': 3 } },
            { text: 'أحسب العائد المالي والزمني', scores: { business: 3, 'voc-admin': 2, 'voc-logistics': 2 } },
            { text: 'أختبر الخيار عملياً أو بدنياً قبل التثبيت', scores: { 'engineering-tech': 2, 'voc-construction': 2, 'voc-sports': 2 } },
            { text: 'أبحث عن الاستدامة والتوافق مع الطبيعة', scores: { health: 2, 'voc-agriculture': 3, 'voc-manufacturing': 1 } }
        ]
    },
    {
        text: 'ما الإنجاز الذي تفخر به حتى لو كان غير ظاهر؟',
        weight: 2,
        answers: [
            { text: 'بناء نظام أو حل تقني يعمل بكفاءة', scores: { 'engineering-tech': 3, 'voc-it': 3, 'voc-manufacturing': 2 } },
            { text: 'إنتاج عمل فني أو أدبي يلامس المشاعر', scores: { 'languages-humanities': 3, 'voc-design': 3, 'voc-crafts': 2 } },
            { text: 'مساعدة شخص على التعافي أو التحسن', scores: { health: 3, 'voc-healthcare': 3 } },
            { text: 'إدارة مشروع من الصفر حتى الربح', scores: { business: 3, 'voc-admin': 3, 'voc-logistics': 1 } },
            { text: 'إصلاح شيء معقد أو تحقيق لياقة عالية', scores: { 'engineering-tech': 2, 'voc-construction': 2, 'voc-sports': 3 } },
            { text: 'تحسين بيئة أو زراعة مشروع مستدام', scores: { health: 2, 'voc-agriculture': 3 } }
        ]
    },
    {
        text: 'كيف يبدو يومك المثالي من العمل إلى الراحة؟',
        weight: 2,
        answers: [
            { text: 'تحليل تقني، تجارب مختبرية، قراءة أبحاث', scores: { 'engineering-tech': 3, 'voc-it': 2, 'voc-manufacturing': 2 } },
            { text: 'إبداع مستمر، كتابة، تصميم، عروض فنية', scores: { 'languages-humanities': 3, 'voc-design': 3, 'voc-crafts': 2 } },
            { text: 'رعاية، علاج، جلسات دعم أو تدريب صحي', scores: { health: 3, 'voc-healthcare': 3, 'voc-social': 2 } },
            { text: 'اجتماعات تخطيط، متابعات، تقارير أداء', scores: { business: 3, 'voc-admin': 3 } },
            { text: 'حركة مستمرة، ورش عملية، أو تمارين رياضية', scores: { 'engineering-tech': 2, 'voc-construction': 2, 'voc-sports': 3 } },
            { text: 'عمل في الهواء الطلق، رعاية مشاريع خضراء', scores: { health: 2, 'voc-agriculture': 3, 'voc-manufacturing': 1 } }
        ]
    }
];

let currentQIndex = 0;
let userAnswers = {};
let scores = Object.fromEntries([...FIELDS.academic, ...FIELDS.vocational].map(k => [k, 0]));

const screens = {
    landing: document.getElementById('landing-screen'),
    question: document.getElementById('question-screen'),
    results: document.getElementById('results-screen')
};
const startBtn = document.getElementById('start-btn');
const loadBtn = document.getElementById('load-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const finishBtn = document.getElementById('finish-btn');
const saveBtn = document.getElementById('save-btn');
const retakeBtn = document.getElementById('retake-btn');
const progressBar = document.getElementById('question-progress');
const progressText = document.getElementById('progress-text');
const questionNumber = document.getElementById('question-number');
const questionTextEl = document.getElementById('question-text');
const answerOptionsEl = document.getElementById('answer-options');
const confidenceSlider = document.getElementById('confidence');

function showScreen(name) {
    if (!screens[name]) return;
    Object.values(screens).forEach(s => { if (s) s.classList.remove('active'); });
    screens[name]?.classList.add('active');
}

function startTest() {
    currentQIndex = 0;
    scores = Object.fromEntries([...FIELDS.academic, ...FIELDS.vocational].map(k => [k, 0]));
    userAnswers = {};
    showScreen('question');
    showQuestion(currentQIndex);
}

function showQuestion(idx) {
    const q = questions[idx];
    questionTextEl.innerText = q.text;
    questionNumber.innerText = `السؤال ${idx + 1}`;
    answerOptionsEl.innerHTML = '';
    if (confidenceSlider) confidenceSlider.value = userAnswers[idx]?.confidence || '3';
    q.answers.forEach((a, i) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.dataset.index = i;
        btn.textContent = a.text;
        if (userAnswers[idx]?.answerIndex === i) btn.classList.add('selected');
        btn.addEventListener('click', (e) => selectAnswer(idx, i, e));
        answerOptionsEl.appendChild(btn);
    });
    updateProgress();
    updateNav();
}

function selectAnswer(qIdx, aIdx, e) {
    userAnswers[qIdx] = { answerIndex: aIdx, confidence: confidenceSlider.value };
    document.querySelectorAll('.answer-btn').forEach(b => b.classList.remove('selected'));
    e.currentTarget.classList.add('selected');
    updateNav();
}

function nextQuestion() {
    if (currentQIndex < questions.length - 1) {
        currentQIndex++;
        showQuestion(currentQIndex);
    }
}

function prevQuestion() {
    if (currentQIndex > 0) {
        currentQIndex--;
        showQuestion(currentQIndex);
    }
}

function updateProgress() {
    const p = ((currentQIndex + 1) / questions.length) * 100;
    progressBar.style.width = `${p}%`;
    progressText.innerText = `السؤال ${currentQIndex + 1} / ${questions.length}`;
}

function updateNav() {
    const isFirst = currentQIndex === 0;
    const isLast = currentQIndex === questions.length - 1;
    const hasAnswer = !!userAnswers[currentQIndex];
    prevBtn.style.display = isFirst ? 'none' : 'inline-block';
    nextBtn.style.display = isLast ? 'none' : 'inline-block';
    finishBtn.style.display = isLast ? 'inline-block' : 'none';
    if (isLast) finishBtn.disabled = !hasAnswer;
    else nextBtn.disabled = !hasAnswer;
}

function calculateResults() {
    var overlay = document.getElementById('testLoadingOverlay');
    if (overlay) overlay.classList.add('active');
    scores = Object.fromEntries([...FIELDS.academic, ...FIELDS.vocational].map(k => [k, 0]));
    questions.forEach((q, i) => {
        const ua = userAnswers[i];
        if (!ua) return;
        const conf = parseInt(ua.confidence);
        const mult = conf === 1 ? 0.5 : conf === 2 ? 0.75 : conf === 4 ? 1.25 : conf === 5 ? 1.5 : 1.0;
        const ansData = q.answers[ua.answerIndex];
        for (const [field, base] of Object.entries(ansData.scores)) {
            scores[field] += base * q.weight * mult;
        }
    });

    const acadTotal = FIELDS.academic.reduce((sum, k) => sum + scores[k], 0);
    const vocTotal = FIELDS.vocational.reduce((sum, k) => sum + scores[k], 0);
    const topPath = acadTotal >= vocTotal ? 'academic' : 'vocational';
    const topField = FIELDS[topPath].reduce((max, k) => scores[k] > scores[max] ? k : max, FIELDS[topPath][0]);
    const altPath = topPath === 'academic' ? 'vocational' : 'academic';
    const altField = FIELDS[altPath].reduce((max, k) => scores[k] > scores[max] ? k : max, FIELDS[altPath][0]);

    displayResults(topPath, topField, altPath, altField);
    displayUserAnswers();
    showScreen('results');
    runCelebration();

    // Store results globally for use by "Match Universities" button
    window._interestTestResult = {
      topField,
      topPath,
      topFieldLabel: FIELD_LABELS[topField],
      topPathLabel: PATH_LABELS[topPath]
    };

    // Save to backend if logged in
    try {
      const auth = window.LearnMapAuth;
      if (auth && auth.isLoggedIn()) {
        auth.saveTestResult('interestTest', {
          topField: FIELD_LABELS[topField],
          topFieldKey: topField,
          topPath: PATH_LABELS[topPath],
          topPathKey: topPath,
          scores
        }).catch(function() {}).then(function() {
          if (overlay) overlay.classList.remove('active');
        });
      } else {
        if (overlay) overlay.classList.remove('active');
      }
    } catch(e) {
      if (overlay) overlay.classList.remove('active');
    }
}

function getLink(field) {
    const links = {
        'health': '/Fields-Awareness/Academic/health-field.html',
        'engineering-tech': '/Fields-Awareness/Academic/science-and-technology-field.html',
        'business': '/Fields-Awareness/Academic/business-and-management-field.html',
        'languages-humanities': '/Fields-Awareness/Academic/languages-and-social-studies.html',
        'voc-it': '/Fields-Awareness/Vocational/Information-Technology-Vocational.html',
        'voc-design': '/Fields-Awareness/Vocational/Art-and-Design-Vocational.html',
        'voc-hospitality': '/Fields-Awareness/Vocational/Hospitality-vocational.html',
        'voc-admin': '/Fields-Awareness/Vocational/Business-and-Management-Vocational.html',
        'voc-construction': '/Fields-Awareness/Vocational/Construction-Vocational.html',
        'voc-agriculture': '/Fields-Awareness/Vocational/Agriculture-Vocational.html',
        'voc-healthcare': '/Fields-Awareness/Vocational/Healthcare-and-Social-Care-Vocational.html',
        'voc-sports': '/Fields-Awareness/Vocational/Sports-Vocational.html',
        'voc-crafts': '/Fields-Awareness/Vocational/Creative-Media-Vocational.html',
        'voc-logistics': '/Fields-Awareness/Vocational/Travel-and-Tourism-Vocational.html',
        'voc-manufacturing': '/Fields-Awareness/Vocational/Engineering-Vocational.html',
        'voc-social': '/Fields-Awareness/Vocational/Hair-and-Beauty-Vocational.html'
    };
    return links[field] || '#';
}

function displayResults(topPath, topField, altPath, altField) {
    const pathLabel = PATH_LABELS[topPath];
    const fieldLabel = FIELD_LABELS[topField];
    const allFields = [...FIELDS.academic, ...FIELDS.vocational];
    const maxScore = Math.max(...allFields.map(k => scores[k]), 1);
    const compatPercent = Math.round((scores[topField] / maxScore) * 100);

    document.getElementById('result-celebration').innerText = `مسارك المقترح: ${fieldLabel} (${pathLabel})`;
    document.getElementById('result-top-field').innerText = fieldLabel;
    document.getElementById('result-top-score').innerText = `${compatPercent}%`;

    const pathBadge = document.getElementById('result-path-badge');
    if (pathBadge) {
        pathBadge.innerText = pathLabel;
        pathBadge.className = `path-badge path-${topPath}`;
    }

    const acadEl = document.getElementById('result-majors');
    if (acadEl) {
        acadEl.innerHTML = `<p><strong>المسار ${pathLabel}:</strong> ${fieldLabel}</p><a href="${getLink(topField)}" class="resource-link" target="_blank">استكشف التفاصيل</a>`;
    }

    const vocEl = document.getElementById('result-vocational');
    if (vocEl) {
        vocEl.innerHTML = `<p><strong>المسار البديل (${PATH_LABELS[altPath]}):</strong> ${FIELD_LABELS[altField]}</p><a href="${getLink(altField)}" class="resource-link" target="_blank">استكشف التفاصيل</a>`;
    }

    const strengthEl = document.getElementById('result-strengths');
    if (strengthEl) {
        const strongFields = allFields
            .filter(f => f !== topField && scores[f] > scores[topField] * 0.6)
            .sort((a, b) => scores[b] - scores[a])
            .slice(0, 3);
        let strengthHTML = `<li>تمتلك ميل قوي نحو ${fieldLabel} في المسار ${pathLabel}</li>`;
        strongFields.forEach(f => {
            const fPath = FIELDS.academic.includes(f) ? 'أكاديمي' : 'مهني';
            strengthHTML += `<li>لديك أيضاً ميل ملحوظ نحو ${FIELD_LABELS[f]} (${fPath})</li>`;
        });
        strengthEl.innerHTML = strengthHTML;
    }

    const altEl = document.getElementById('result-skills');
    if (altEl) {
        const alts = FIELDS[topPath].filter(f => f !== topField && scores[f] > scores[topField] * 0.5).slice(0, 3);
        altEl.innerHTML = alts.map(a => `<li><a href="${getLink(a)}">${FIELD_LABELS[a]}</a></li>`).join('') || '<li>لا توجد بدائل قريبة حالياً</li>';
    }

    const learnEl = document.getElementById('result-learning-style');
    if (learnEl) {
        learnEl.innerHTML = `<p>ابدأ بمشروع صغير أو تدريب عملي في مجال ${fieldLabel}</p>`;
    }

    drawHeatmap(scores);
}
function drawHeatmap(s) {
    const canvas = document.getElementById('heatmap-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. تحديد لون النص بناءً على الوضع الليلي أو النهاري
    const isDarkMode = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) 
                       || document.body.classList.contains('dark-mode'); 
    
    const textColor = isDarkMode ? '#e0e0e0' : '#333333';

    const acadKeys = FIELDS.academic;
    const vocKeys = FIELDS.vocational;
    const allKeys = [...acadKeys, ...vocKeys];
    const max = Math.max(...allKeys.map(k => s[k]), 1);
    const w = canvas.width / allKeys.length;
    const gap = 4;
    const sectionEnd = acadKeys.length;

    const labelFontSize = Math.max(12, Math.min(14, w * 0.8)) + 'px sans-serif';
    const legendFontSize = '14px sans-serif';

    // 2. زيادة الهامش السفلي إلى 100 بكسل لضمان عدم قص النص المائل نهائياً
    const bottomMargin = 100; 

    allKeys.forEach((k, i) => {
        const h = (s[k] / max) * (canvas.height * 0.6);
        const isAcademic = i < sectionEnd;
        ctx.fillStyle = isAcademic ? '#4a90e2' : '#e98a2e';
        
        // رفع الأعمدة للأعلى بمقدار الهامش الجديد
        ctx.fillRect(i * w + gap, canvas.height - h - bottomMargin, w - gap * 2, h);

        ctx.save();
        // 3. رفع نقطة رسم النص إلى canvas.height - 85 لإعطاء مساحة كافية لذيل النص المائل
        ctx.translate(i * w + w / 2, canvas.height - 85);
        ctx.rotate(-Math.PI / 4);
        
        ctx.fillStyle = textColor;
        ctx.font = labelFontSize;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle'; 
        
        ctx.fillText(FIELD_LABELS[k] || k, 0, 0);
        ctx.restore();
    });

    // 4. مفتاح الخريطة (Legend)
    ctx.fillStyle = '#4a90e2';
    ctx.fillRect(10, 10, 16, 16);
    ctx.fillStyle = textColor;
    ctx.font = `bold ${legendFontSize}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('أكاديمي', 34, 18);

    ctx.fillStyle = '#e98a2e';
    ctx.fillRect(120, 10, 16, 16);
    ctx.fillStyle = textColor;
    ctx.fillText('مهني', 144, 18);
}
function runCelebration() {
    const dur = 3000;
    const end = Date.now() + dur;
    const interval = setInterval(() => {
        if (Date.now() > end) return clearInterval(interval);
        const p = 50 * (1 - (Date.now() - end + dur) / dur);
        if (typeof confetti === 'function') {
            confetti({ particleCount: p, origin: { x: 0.2, y: 0 }, colors: ['#bb0000', '#ffd700'] });
            confetti({ particleCount: p, origin: { x: 0.8, y: 0 }, colors: ['#00bb00', '#0099ff'] });
        }
    }, 250);
    const msg = document.getElementById('celebration-message');
    if (msg) {
        msg.classList.add('show');
        setTimeout(() => msg.classList.remove('show'), 4000);
    }
}

function displayUserAnswers() {
    const c = document.getElementById('user-answers-summary');
    if (!c) return;
    let h = '<ul class="answers-list" style="list-style:none;padding:0">';
    questions.forEach((q, i) => {
        const ans = userAnswers[i];
        if (!ans) return;
        const conf = parseInt(ans.confidence);
        const confLabel = conf <= 2 ? 'غير متأكد' : conf >= 4 ? 'متأكد جداً' : 'متوسط الثقة';
        h += `<li style="margin-bottom:1rem;padding-bottom:1rem;border-bottom:1px solid #eee">
            <strong>س${i + 1}:</strong> ${q.text}<br>
            <span style="color:#2c6fbb;display:block;margin:0.3rem 0">${q.answers[ans.answerIndex].text}</span>
            <span style="color:#888;font-size:0.85rem">الثقة: ${confLabel}</span>
        </li>`;
    });
    c.innerHTML = h + '</ul>';
}

function saveProgress() {
    try {
        localStorage.setItem('interestTestProgress', JSON.stringify({ userAnswers, currentQIndex }));
        alert('تم الحفظ');
    } catch (e) {
        alert('فشل الحفظ');
    }
}

function loadProgress() {
    try {
        const d = JSON.parse(localStorage.getItem('interestTestProgress'));
        if (d) {
            userAnswers = d.userAnswers || {};
            currentQIndex = d.currentQIndex || 0;
            showScreen('question');
            showQuestion(currentQIndex);
        } else {
            alert('لا يوجد بيانات محفوظة');
        }
    } catch (e) {
        alert('فشل التحميل');
    }
}

function restartTest() {
    if (confirm('إعادة الاختبار؟')) {
        localStorage.removeItem('interestTestProgress');
        location.reload();
    }
}

startBtn?.addEventListener('click', startTest);
loadBtn?.addEventListener('click', loadProgress);
saveBtn?.addEventListener('click', saveProgress);
retakeBtn?.addEventListener('click', restartTest);
prevBtn?.addEventListener('click', prevQuestion);
nextBtn?.addEventListener('click', nextQuestion);
finishBtn?.addEventListener('click', calculateResults);
confidenceSlider?.addEventListener('input', () => {
    if (userAnswers[currentQIndex] !== undefined) {
        userAnswers[currentQIndex].confidence = confidenceSlider.value;
    }
});

});
// Navigate to university matcher with interest test results pre-filled
window.goToMatcher = function() {
  const result = window._interestTestResult;
  if (result) {
    const params = new URLSearchParams({
      field: result.topField,
      path: result.topPath,
      fieldLabel: result.topFieldLabel
    });
    window.location.href = '/career-guidance/university-matcher.html?' + params.toString();
  } else {
    window.location.href = '/career-guidance/university-matcher.html';
  }
};
