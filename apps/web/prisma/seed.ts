import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Türkçe isimler için yardımcı fonksiyonlar
const firstNames = {
  male: ['Ali', 'Mehmet', 'Ahmet', 'Mustafa', 'Hasan', 'Hüseyin', 'İbrahim', 'Osman', 'Yusuf', 'Emre'],
  female: ['Ayşe', 'Fatma', 'Zeynep', 'Elif', 'Merve', 'Selin', 'Deniz', 'Ceren', 'Büşra', 'Dilara'],
}

const lastNames = [
  'Yılmaz', 'Kaya', 'Demir', 'Şahin', 'Çelik', 'Yıldız', 'Yıldırım', 'Öztürk', 'Aydın', 'Özdemir',
  'Arslan', 'Doğan', 'Kılıç', 'Aslan', 'Çetin', 'Kara', 'Koç', 'Kurt', 'Özkan', 'Şimşek',
]

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomDate(minAge: number, maxAge: number): Date {
  const today = new Date()
  const maxDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate())
  const minDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate())
  const randomTime = minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime())
  return new Date(randomTime)
}

async function main() {
  console.log('🌱 Seeding database with comprehensive data...')

  // 10 Nörogelişimsel Alanı Ekle
  console.log('📚 Creating development domains...')
  const domains = [
    {
      code: 'executive_functions',
      nameTr: 'Yürütücü İşlevler',
      nameEn: 'Executive Functions',
      description: 'Hafıza, odaklanma, dürtü kontrolü',
      iconName: 'Brain',
      color: '#3B82F6',
    },
    {
      code: 'language_communication',
      nameTr: 'Dil ve İletişim',
      nameEn: 'Language & Communication',
      description: 'Kelime dağarcığı, hikaye anlatımı, fonetik farkındalık',
      iconName: 'MessageCircle',
      color: '#10B981',
    },
    {
      code: 'social_emotional',
      nameTr: 'Sosyal ve Duygusal Zeka',
      nameEn: 'Social & Emotional',
      description: 'Empati, iş birliği, duygu regülasyonu',
      iconName: 'Heart',
      color: '#F59E0B',
    },
    {
      code: 'gross_motor',
      nameTr: 'Kaba Motor Beceriler',
      nameEn: 'Gross Motor',
      description: 'Denge, koordinasyon, fiziksel güç',
      iconName: 'Activity',
      color: '#EF4444',
    },
    {
      code: 'fine_motor',
      nameTr: 'İnce Motor Beceriler',
      nameEn: 'Fine Motor',
      description: 'El-göz koordinasyonu, kalem tutma, küçük nesneleri manipüle etme',
      iconName: 'Hand',
      color: '#8B5CF6',
    },
    {
      code: 'logical_numerical',
      nameTr: 'Mantıksal ve Sayısal Muhakeme',
      nameEn: 'Logical & Numerical',
      description: 'Sıralama, örüntü, sayı algısı',
      iconName: 'Calculator',
      color: '#06B6D4',
    },
    {
      code: 'creative_expression',
      nameTr: 'Yaratıcı ve Estetik İfade',
      nameEn: 'Creative Expression',
      description: 'Müzik, sanat, hayal gücü kullanımı',
      iconName: 'Palette',
      color: '#EC4899',
    },
    {
      code: 'spatial_awareness',
      nameTr: 'Mekansal Farkındalık',
      nameEn: 'Spatial Awareness',
      description: 'Yön bulma, nesnelerin uzaydaki konumu',
      iconName: 'Compass',
      color: '#14B8A6',
    },
    {
      code: 'discovery_world',
      nameTr: 'Dünya Keşfi ve Bilimsel Merak',
      nameEn: 'Discovery of the World',
      description: 'Doğa olaylarını anlama, neden-sonuç ilişkisi',
      iconName: 'Globe',
      color: '#84CC16',
    },
    {
      code: 'self_help',
      nameTr: 'Öz-Bakım ve Bağımsızlık',
      nameEn: 'Self-Help & Independence',
      description: 'Kendi işini yapabilme, hijyen, giyinme',
      iconName: 'User',
      color: '#6366F1',
    },
  ]

  const createdDomains = []
  for (const domain of domains) {
    const created = await prisma.developmentDomain.upsert({
      where: { code: domain.code },
      update: {},
      create: domain,
    })
    createdDomains.push(created)
  }
  console.log(`✅ Created ${createdDomains.length} development domains`)

  // Admin Kullanıcı
  console.log('👤 Creating admin user...')
  const admin = await prisma.user.upsert({
    where: { email: 'admin@harmoni.com' },
    update: {},
    create: {
      email: 'admin@harmoni.com',
      fullName: 'Müdür Ayşe Yılmaz',
      role: 'admin',
      phone: '+90 555 123 4567',
    },
  })
  console.log('✅ Created admin user')

  // 20 Öğretmen Oluştur
  console.log('👨‍🏫 Creating 20 teachers...')
  const teachers = []
  for (let i = 1; i <= 20; i++) {
    const gender = i % 2 === 0 ? 'female' : 'male'
    const firstName = getRandomElement(firstNames[gender])
    const lastName = getRandomElement(lastNames)
    const teacher = await prisma.user.upsert({
      where: { email: `ogretmen${i}@harmoni.com` },
      update: {},
      create: {
        email: `ogretmen${i}@harmoni.com`,
        fullName: `Öğretmen ${firstName} ${lastName}`,
        role: 'teacher',
        phone: `+90 555 ${100 + i} ${1000 + i}`,
      },
    })
    teachers.push(teacher)
  }
  console.log(`✅ Created ${teachers.length} teachers`)

  // 5-6 Sınıf Oluştur
  console.log('🏫 Creating classes...')
  const classNames = ['Kelebekler', 'Yıldızlar', 'Güneşler', 'Ayçiçekleri', 'Papatyalar', 'Laleler']
  const ageGroups = ['2-3', '3-4', '4-5', '5-6']
  const classes = []
  
  for (let i = 0; i < 6; i++) {
    const className = classNames[i]
    const ageGroup = ageGroups[i % ageGroups.length]
    const classData = await prisma.class.upsert({
      where: { id: `class-${i + 1}` },
      update: {},
      create: {
        id: `class-${i + 1}`,
        name: `${className} Sınıfı`,
        ageGroup,
        capacity: 20,
        currentEnrollment: 0,
        academicYear: '2024-2025',
        isActive: true,
      },
    })
    classes.push(classData)
  }
  console.log(`✅ Created ${classes.length} classes`)

  // Öğretmen-Sınıf İlişkileri (Her sınıfa 2-3 öğretmen)
  console.log('🔗 Creating class-teacher relationships...')
  for (let i = 0; i < classes.length; i++) {
    const classData = classes[i]
    const teachersForClass = teachers.slice(i * 3, (i + 1) * 3).slice(0, 3)
    
    for (let j = 0; j < teachersForClass.length; j++) {
      await prisma.classTeacher.upsert({
        where: {
          classId_teacherId: {
            classId: classData.id,
            teacherId: teachersForClass[j].id,
          },
        },
        update: {},
        create: {
          classId: classData.id,
          teacherId: teachersForClass[j].id,
          isLeadTeacher: j === 0,
        },
      })
    }
  }
  console.log('✅ Created class-teacher relationships')

  // 20 Öğrenci Oluştur
  console.log('👶 Creating 20 students...')
  const students: Array<{ id: string; firstName: string; lastName: string }> = []
  for (let i = 1; i <= 20; i++) {
    const gender = i % 2 === 0 ? 'female' : 'male'
    const firstName = getRandomElement(firstNames[gender])
    const lastName = getRandomElement(lastNames)
    const age = 2 + (i % 4) // 2-5 yaş arası
    const dateOfBirth = getRandomDate(age, age + 1)
    
    const student = await prisma.student.create({
      data: {
        firstName,
        lastName,
        dateOfBirth,
        gender: gender === 'male' ? 'male' : 'female',
        enrollmentDate: new Date('2024-09-01'),
        isActive: true,
      },
    })
    students.push(student)
  }
  console.log(`✅ Created ${students.length} students`)

  // 20 Veli Oluştur (Her öğrenci için bir veli)
  console.log('👨‍👩‍👧 Creating 20 parents...')
  const parents: Array<{ id: string; email: string }> = []
  for (let i = 1; i <= 20; i++) {
    const gender = i % 2 === 0 ? 'female' : 'male'
    const firstName = getRandomElement(firstNames[gender])
    const lastName = students[i - 1].lastName // Öğrenci ile aynı soyad
    
    const parent = await prisma.user.upsert({
      where: { email: `veli${i}@harmoni.com` },
      update: {},
      create: {
        email: `veli${i}@harmoni.com`,
        fullName: `Veli ${firstName} ${lastName}`,
        role: 'parent',
        phone: `+90 555 ${200 + i} ${2000 + i}`,
      },
    })
    parents.push(parent)
  }
  console.log(`✅ Created ${parents.length} parents`)

  // Veli-Öğrenci İlişkileri
  console.log('👨‍👩‍👧 Creating parent-student relationships...')
  for (let i = 0; i < students.length; i++) {
    await prisma.parentStudent.create({
      data: {
        parentId: parents[i].id,
        studentId: students[i].id,
        relationship: 'parent',
      },
    })
  }
  console.log('✅ Created parent-student relationships')

  // Öğrencileri Sınıflara Dağıt
  console.log('🎓 Distributing students to classes...')
  const studentsPerClass = Math.ceil(students.length / classes.length)
  for (let i = 0; i < students.length; i++) {
    const classIndex = Math.floor(i / studentsPerClass)
    const classData = classes[classIndex]
    
    await prisma.classStudent.create({
      data: {
        classId: classData.id,
        studentId: students[i].id,
        enrollmentDate: new Date('2024-09-01'),
        isActive: true,
      },
    })
  }
  console.log('✅ Distributed students to classes')

  // Sınıf doluluk sayılarını güncelle
  for (const classData of classes) {
    const count = await prisma.classStudent.count({
      where: { classId: classData.id, isActive: true },
    })
    await prisma.class.update({
      where: { id: classData.id },
      data: { currentEnrollment: count },
    })
  }

  // Aktiviteler Oluştur (Her alan için 2-3 aktivite)
  console.log('🎨 Creating activities...')
  const activities = []
  const activityTemplates = [
    { title: 'Boncuk Dizme Oyunu', domain: 'fine_motor', difficulty: 2 },
    { title: 'Hamur Atölyesi', domain: 'fine_motor', difficulty: 1 },
    { title: 'Paylaşım Oyunu', domain: 'social_emotional', difficulty: 2 },
    { title: 'Denge Oyunu', domain: 'gross_motor', difficulty: 3 },
    { title: 'Hikaye Anlatma', domain: 'language_communication', difficulty: 2 },
    { title: 'Sayı Oyunları', domain: 'logical_numerical', difficulty: 3 },
    { title: 'Resim Yapma', domain: 'creative_expression', difficulty: 1 },
    { title: 'Yön Bulma Oyunu', domain: 'spatial_awareness', difficulty: 2 },
    { title: 'Doğa Gözlemi', domain: 'discovery_world', difficulty: 2 },
    { title: 'Kendi Başına Giyinme', domain: 'self_help', difficulty: 3 },
    { title: 'Hafıza Oyunu', domain: 'executive_functions', difficulty: 3 },
    { title: 'Kalem Tutma Çalışması', domain: 'fine_motor', difficulty: 2 },
    { title: 'Empati Oyunu', domain: 'social_emotional', difficulty: 2 },
    { title: 'Koşu Yarışı', domain: 'gross_motor', difficulty: 1 },
    { title: 'Kelime Oyunu', domain: 'language_communication', difficulty: 2 },
  ]

  for (const template of activityTemplates) {
    const domain = createdDomains.find((d) => d.code === template.domain)!
    const activity = await prisma.activity.create({
      data: {
        title: template.title,
        description: `${template.title} aktivitesi`,
        domainId: domain.id,
        ageMin: 2,
        ageMax: 6,
        durationMinutes: 20 + Math.floor(Math.random() * 20),
        materialsNeeded: JSON.stringify(['Materyal 1', 'Materyal 2']),
        instructions: `${template.title} için detaylı talimatlar`,
        difficultyLevel: template.difficulty,
        isActive: true,
      },
    })
    activities.push(activity)
  }
  console.log(`✅ Created ${activities.length} activities`)

  // Örnek Değerlendirmeler (Her öğrenci için 1-2 değerlendirme)
  console.log('📊 Creating sample assessments...')
  let assessmentCount = 0
  for (let i = 0; i < students.length; i++) {
    const student = students[i]
    const studentClass = await prisma.classStudent.findFirst({
      where: { studentId: student.id, isActive: true },
      include: { class: { include: { classTeachers: true } } },
    })

    if (studentClass && studentClass.class.classTeachers.length > 0) {
      const teacher = studentClass.class.classTeachers[0].teacherId
      const assessment = await prisma.assessment.create({
        data: {
          studentId: student.id,
          assessedBy: teacher,
          assessmentDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Son 30 gün içinde
          notes: `${student.firstName} için değerlendirme notları`,
        },
      })

      // Her değerlendirme için 3-5 alan skoru
      const domainsToAssess = createdDomains
        .sort(() => Math.random() - 0.5)
        .slice(0, 3 + Math.floor(Math.random() * 3))

      for (const domain of domainsToAssess) {
        await prisma.assessmentScore.create({
          data: {
            assessmentId: assessment.id,
            domainId: domain.id,
            score: 2 + Math.floor(Math.random() * 4), // 2-5 arası
            percentage: 40 + Math.floor(Math.random() * 60), // 40-100 arası
            observationNotes: `${domain.nameTr} alanında gözlem notları`,
          },
        })
      }
      assessmentCount++
    }
  }
  console.log(`✅ Created ${assessmentCount} assessments with scores`)

  // Aktivite Önerileri (Düşük skorlu öğrenciler için)
  console.log('💡 Creating activity recommendations...')
  let recommendationCount = 0
  for (const student of students.slice(0, 10)) {
    // Son değerlendirmeyi bul
    const lastAssessment = await prisma.assessment.findFirst({
      where: { studentId: student.id },
      include: { scores: true },
      orderBy: { assessmentDate: 'desc' },
    })

    if (lastAssessment) {
      // Düşük skorlu alanları bul (score < 3)
      const lowScores = lastAssessment.scores.filter((s) => s.score && s.score < 3)
      
      for (const score of lowScores.slice(0, 2)) {
        // İlgili alan için aktivite bul
        const domain = createdDomains.find((d) => d.id === score.domainId)
        if (domain) {
          const relatedActivity = activities.find((a) => a.domainId === domain.id)
          if (relatedActivity) {
            await prisma.activityRecommendation.create({
              data: {
                studentId: student.id,
                activityId: relatedActivity.id,
                domainId: domain.id,
                reason: `${domain.nameTr} skoru düşük (${score.score}/5). ${relatedActivity.title} aktivitesi önerilir.`,
                thresholdScore: 3,
                currentScore: score.score || 2,
                recommendedTo: 'teacher',
                status: 'pending',
              },
            })
            recommendationCount++
          }
        }
      }
    }
  }
  console.log(`✅ Created ${recommendationCount} activity recommendations`)

  // Günlük Loglar (Son 7 gün için örnek loglar)
  console.log('📝 Creating daily logs...')
  const today = new Date()
  let logCount = 0
  for (let day = 0; day < 7; day++) {
    const logDate = new Date(today)
    logDate.setDate(today.getDate() - day)
    
    for (const student of students.slice(0, 10)) {
      const studentClass = await prisma.classStudent.findFirst({
        where: { studentId: student.id, isActive: true },
        include: { class: { include: { classTeachers: true } } },
      })

      if (studentClass && studentClass.class.classTeachers.length > 0) {
        const teacher = studentClass.class.classTeachers[0].teacherId
        await prisma.dailyLog.create({
          data: {
            studentId: student.id,
            classId: studentClass.classId,
            logDate,
            loggedBy: teacher,
            breakfastEaten: Math.random() > 0.2,
            lunchEaten: Math.random() > 0.1,
            snackEaten: Math.random() > 0.3,
            napStartTime: '13:00',
            napEndTime: '14:30',
            napDurationMinutes: 60 + Math.floor(Math.random() * 60),
            sleepQuality: getRandomElement(['good', 'restless', 'difficult']),
            toiletVisits: 2 + Math.floor(Math.random() * 3),
            accidents: Math.random() > 0.8 ? 1 : 0,
            generalNotes: 'Günlük notlar',
          },
        })
        logCount++
      }
    }
  }
  console.log(`✅ Created ${logCount} daily logs`)

  // Duygu Durumu Takibi
  console.log('😊 Creating mood tracker entries...')
  let moodCount = 0
  for (let day = 0; day < 3; day++) {
    const logDate = new Date(today)
    logDate.setDate(today.getDate() - day)
    
    for (const student of students.slice(0, 10)) {
      const studentClass = await prisma.classStudent.findFirst({
        where: { studentId: student.id, isActive: true },
        include: { class: { include: { classTeachers: true } } },
      })

      if (studentClass && studentClass.class.classTeachers.length > 0) {
        const teacher = studentClass.class.classTeachers[0].teacherId
        await prisma.moodTracker.create({
          data: {
            studentId: student.id,
            logDate,
            timeOfDay: getRandomElement(['morning', 'afternoon', 'evening']),
            mood: getRandomElement(['very_happy', 'happy', 'neutral', 'calm', 'energetic']),
            stressLevel: 1 + Math.floor(Math.random() * 3),
            notes: 'Duygu durumu notları',
            loggedBy: teacher,
          },
        })
        moodCount++
      }
    }
  }
  console.log(`✅ Created ${moodCount} mood tracker entries`)

  // ========== V2 MODULES ==========
  
  // Child Neuro DNA Profiles
  console.log('🧬 Creating Child Neuro DNA Profiles...')
  let profileCount = 0
  try {
    for (const student of students) {
    // Her öğrenci için assessment skorlarından hesaplanmış profil oluştur
    const assessments = await prisma.assessment.findMany({
      where: { studentId: student.id },
      include: { scores: { include: { domain: true } } },
    })

    // Domain kodlarına göre skorları topla
    const domainScores: Record<string, number[]> = {}
    assessments.forEach((a) => {
      a.scores.forEach((s) => {
        const code = s.domain.code
        if (!domainScores[code]) domainScores[code] = []
        const value = s.percentage ?? (s.score ? (s.score / 5) * 100 : 50)
        domainScores[code].push(value)
      })
    })

    // Ortalamaları hesapla
    const avg = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 50

    const profileData = {
      studentId: student.id,
      executiveScore: avg(domainScores['executive_functions'] || []),
      languageScore: avg(domainScores['language_communication'] || []),
      emotionalScore: avg(domainScores['social_emotional'] || []),
      grossMotorScore: avg(domainScores['gross_motor'] || []),
      fineMotorScore: avg(domainScores['fine_motor'] || []),
      logicScore: avg(domainScores['logical_numerical'] || []),
      creativeScore: avg(domainScores['creative_expression'] || []),
      spatialScore: avg(domainScores['spatial_awareness'] || []),
      discoveryScore: avg(domainScores['discovery_world'] || []),
      independenceScore: avg(domainScores['self_help'] || []),
    }

    // Dominant, risk ve growth alanlarını hesapla
    const allScores = [
      { name: 'Yürütücü İşlevler', score: profileData.executiveScore },
      { name: 'Dil ve İletişim', score: profileData.languageScore },
      { name: 'Sosyal Duygusal', score: profileData.emotionalScore },
      { name: 'Kaba Motor', score: profileData.grossMotorScore },
      { name: 'İnce Motor', score: profileData.fineMotorScore },
      { name: 'Mantıksal Sayısal', score: profileData.logicScore },
      { name: 'Yaratıcı İfade', score: profileData.creativeScore },
      { name: 'Mekansal Farkındalık', score: profileData.spatialScore },
      { name: 'Dünya Keşfi', score: profileData.discoveryScore },
      { name: 'Bağımsızlık', score: profileData.independenceScore },
    ]

    const sorted = [...allScores].sort((a, b) => b.score - a.score)
    const dominantAreas = sorted.slice(0, 3).map((s) => s.name)
    const riskAreas = sorted.slice(-2).filter((s) => s.score < 50).map((s) => s.name)
    const growthPotential = sorted.slice(3, 6).map((s) => s.name)
    const avgScore = allScores.reduce((sum, s) => sum + s.score, 0) / allScores.length

      await (prisma as any).childNeuroProfile.upsert({
      where: { studentId: student.id },
      update: profileData,
      create: profileData,
    })
      profileCount++
    }
    console.log(`✅ Created ${profileCount} Neuro DNA Profiles`)
  } catch (error: any) {
    if (error.code === 'P2021' || error.message?.includes('does not exist')) {
      console.log('⚠️  ChildNeuroProfile table does not exist. Skipping...')
    } else {
      throw error
    }
  }

  // Daily Emotion Snapshots (Son 7 gün)
  console.log('😊 Creating Daily Emotion Snapshots...')
  let emotionCount = 0
  try {
    for (let day = 0; day < 7; day++) {
    const snapshotDate = new Date(today)
    snapshotDate.setDate(today.getDate() - day)
    
    for (const student of students.slice(0, 15)) {
      const studentClass = await prisma.classStudent.findFirst({
        where: { studentId: student.id, isActive: true },
        include: { class: { include: { classTeachers: true } } },
      })

      if (studentClass && studentClass.class.classTeachers.length > 0) {
        const teacher = studentClass.class.classTeachers[0].teacherId
        const moods = [1, 2, 3, 4, 5]
        const highlights = [
          'Bugün arkadaşlarıyla çok güzel oyunlar oynadı.',
          'Yeni bir kelime öğrendi ve kullanmaya başladı.',
          'Paylaşım konusunda çok iyi bir gün geçirdi.',
          'Dikkat süresi uzadı, aktivitelere daha iyi odaklandı.',
          'Yardımlaşma konusunda örnek davranışlar sergiledi.',
        ]
        const challenges = [
          'Öğle uykusunda biraz zorlandı.',
          'Sabah ayrılık kaygısı yaşadı.',
          'Paylaşım konusunda biraz zorlandı.',
          'Dikkatini toplamakta güçlük çekti.',
        ]

        await (prisma as any).dailyEmotionSnapshot.create({
          data: {
            studentId: student.id,
            date: snapshotDate,
            mood: getRandomElement(moods),
            highlight: getRandomElement(highlights),
            challenge: Math.random() > 0.5 ? getRandomElement(challenges) : null,
            note: `${student.firstName} için günlük duygu durumu notları.`,
            teacherId: teacher,
          },
        })
        emotionCount++
      }
    }
    }
    console.log(`✅ Created ${emotionCount} Daily Emotion Snapshots`)
  } catch (error: any) {
    if (error.code === 'P2021' || error.message?.includes('does not exist')) {
      console.log('⚠️  DailyEmotionSnapshot table does not exist. Skipping...')
    } else {
      throw error
    }
  }

  // AI Child Summaries (Son 7 gün)
  console.log('🤖 Creating AI Child Summaries...')
  let summaryCount = 0
  try {
    for (let day = 0; day < 7; day++) {
    const summaryDate = new Date(today)
    summaryDate.setDate(today.getDate() - day)
    
    for (const student of students.slice(0, 10)) {
      const progressTexts = [
        `Bugün ${student.firstName} sosyal alanda %2 ilerleme gösterdi. Arkadaşlarıyla oyun oynarken paylaşım konusunda daha istekli davrandı.`,
        `${student.firstName} bugün dil gelişimi açısından yeni kelimeler kullanmaya başladı. Hikaye anlatma aktivitesinde aktif rol aldı.`,
        `Bugün ${student.firstName} ince motor becerilerinde gelişim gösterdi. Kalem tutma ve çizim aktivitelerinde daha kontrollü hareketler sergiledi.`,
        `${student.firstName} bugün duygusal regülasyon konusunda ilerleme kaydetti. Zorlandığı durumlarda daha sakin kalabildi.`,
      ]
      const homeRecommendations = [
        'Evde paylaşım oyunları oynayabilirsiniz. Oyuncakları paylaşma konusunda model olun.',
        'Hikaye okuma saatlerini artırabilirsiniz. Okuduktan sonra hikaye hakkında sorular sorun.',
        'Evde boyama ve çizim aktiviteleri yapabilirsiniz. Kalem tutuşunu destekleyin.',
        'Duyguları konuşmak için zaman ayırın. "Bugün nasıl hissettin?" gibi sorular sorun.',
      ]

      await (prisma as any).aIChildSummary.create({
        data: {
          studentId: student.id,
          date: summaryDate,
          progressText: getRandomElement(progressTexts),
          homeRecommendation: getRandomElement(homeRecommendations),
        },
      })
      summaryCount++
    }
    }
    console.log(`✅ Created ${summaryCount} AI Child Summaries`)
  } catch (error: any) {
    if (error.code === 'P2021' || error.message?.includes('does not exist')) {
      console.log('⚠️  AIChildSummary table does not exist. Skipping...')
    } else {
      throw error
    }
  }

  // Neuro Alerts (Risk tespit edilen öğrenciler için)
  console.log('⚠️ Creating Neuro Alerts...')
  let alertCount = 0
  try {
    const riskStudents = students.slice(0, 5) // İlk 5 öğrenci için risk uyarısı
    const riskDomains = [
      'Yürütücü İşlevler',
      'Dil ve İletişim',
      'Sosyal Duygusal',
      'İnce Motor',
      'Kaba Motor',
    ]
    const severities = ['low', 'medium', 'high'] as const

    for (const student of riskStudents) {
      const profile = await (prisma as any).childNeuroProfile.findUnique({
        where: { studentId: student.id },
      })

      if (profile) {
        const scores = [
          { domain: 'Yürütücü İşlevler', score: profile.executiveScore },
          { domain: 'Dil ve İletişim', score: profile.languageScore },
          { domain: 'Sosyal Duygusal', score: profile.emotionalScore },
          { domain: 'İnce Motor', score: profile.fineMotorScore },
          { domain: 'Kaba Motor', score: profile.grossMotorScore },
        ]

        const lowScores = scores.filter((s) => s.score < 45)
        if (lowScores.length > 0) {
          const riskDomain = lowScores[0]
          const severity = riskDomain.score < 35 ? 'high' : riskDomain.score < 40 ? 'medium' : 'low'

          await (prisma as any).neuroAlert.create({
            data: {
              studentId: student.id,
              domain: riskDomain.domain,
              severity,
              message: `${riskDomain.domain} alanında düşük performans tespit edildi (${riskDomain.score.toFixed(1)}%). Ek destek önerilir.`,
            },
          })
          alertCount++
        }
      }
    }
    console.log(`✅ Created ${alertCount} Neuro Alerts`)
  } catch (error: any) {
    if (error.code === 'P2021' || error.message?.includes('does not exist')) {
      console.log('⚠️  NeuroAlert table does not exist. Skipping...')
    } else {
      throw error
    }
  }

  // Quick Assessments (Hızlı değerlendirmeler)
  console.log('⚡ Creating Quick Assessments...')
  let quickAssessmentCount = 0
  try {
    for (const student of students.slice(0, 10)) {
      const studentClass = await prisma.classStudent.findFirst({
      where: { studentId: student.id, isActive: true },
      include: { class: { include: { classTeachers: true } } },
    })

    if (studentClass && studentClass.class.classTeachers.length > 0) {
      const teacher = studentClass.class.classTeachers[0].teacherId
      const quickDomains = createdDomains.slice(0, 3)

      for (const domain of quickDomains) {
        await (prisma as any).quickAssessment.create({
          data: {
            studentId: student.id,
            domain: domain.code,
            score: getRandomElement([1, 3, 5]), // 1=red, 3=yellow, 5=green
            assessedBy: teacher,
          },
        })
        quickAssessmentCount++
      }
    }
    }
    console.log(`✅ Created ${quickAssessmentCount} Quick Assessments`)
  } catch (error: any) {
    if (error.code === 'P2021' || error.message?.includes('does not exist')) {
      console.log('⚠️  QuickAssessment table does not exist. Skipping...')
    } else {
      throw error
    }
  }

  // Child Development Trends (Son 4 hafta)
  console.log('📈 Creating Development Trends...')
  let trendCount = 0
  try {
    for (let week = 0; week < 4; week++) {
      const periodStart = new Date(today)
    periodStart.setDate(today.getDate() - (week + 1) * 7)
    const periodEnd = new Date(periodStart)
    periodEnd.setDate(periodStart.getDate() + 7)

    for (const student of students.slice(0, 10)) {
      const domains = ['executive_functions', 'language', 'social_emotional', 'gross_motor', 'fine_motor']
      
      for (const domain of domains) {
        // Rastgele delta değeri (-0.2 ile +0.2 arası)
        const delta = (Math.random() - 0.5) * 0.4

        await (prisma as any).childDevelopmentTrend.create({
          data: {
            studentId: student.id,
            domain,
            periodStart,
            periodEnd,
            delta,
          },
        })
        trendCount++
      }
    }
    }
    console.log(`✅ Created ${trendCount} Development Trends`)
  } catch (error: any) {
    if (error.code === 'P2021' || error.message?.includes('does not exist')) {
      console.log('⚠️  ChildDevelopmentTrend table does not exist. Skipping...')
    } else {
      throw error
    }
  }

  // Notifications (Admin, Teacher, AI tarafından gönderilen)
  console.log('🔔 Creating Notifications...')
  let notificationCount = 0
  try {
    const adminUser = await prisma.user.findFirst({ where: { role: 'admin' } })

    // Admin'den tüm velilere genel bildirim
    if (adminUser) {
      for (const parent of parents.slice(0, 10)) {
      await (prisma as any).notification.create({
        data: {
          recipientId: parent.id,
          senderId: adminUser.id,
          senderType: 'admin',
          type: 'info',
          title: 'Yeni Dönem Başladı!',
          message: '2024-2025 eğitim öğretim yılı başladı. Çocuğunuzun gelişimini takip edebilirsiniz.',
        },
      })
        notificationCount++
      }
    }

    // Öğretmenlerden velilere öğrenci bazlı bildirimler
    for (const student of students.slice(0, 5)) {
    const parent = parents.find((p, i) => i === students.indexOf(student))
    const studentClass = await prisma.classStudent.findFirst({
      where: { studentId: student.id, isActive: true },
      include: { class: { include: { classTeachers: true } } },
    })

    if (parent && studentClass && studentClass.class.classTeachers.length > 0) {
      const teacher = await prisma.user.findUnique({
        where: { id: studentClass.class.classTeachers[0].teacherId },
      })

      if (teacher) {
        await (prisma as any).notification.create({
          data: {
            recipientId: parent.id,
            senderId: teacher.id,
            studentId: student.id,
            senderType: 'teacher',
            type: 'info',
            title: `${student.firstName} Hakkında Güncelleme`,
            message: `${student.firstName} bugün çok güzel bir gün geçirdi. Sosyal aktivitelerde aktif rol aldı.`,
            actionUrl: `/parent/children/${student.id}`,
          },
        })
        notificationCount++
      }
    }
    }

    // AI'dan velilere özet bildirimler
    for (const student of students.slice(0, 5)) {
      const parent = parents.find((p, i) => i === students.indexOf(student))
      if (parent) {
        await (prisma as any).notification.create({
          data: {
            recipientId: parent.id,
            studentId: student.id,
            senderType: 'ai',
            type: 'ai_summary',
            title: 'Haftalık Gelişim Özeti',
            message: `${student.firstName} için haftalık gelişim özeti hazır. Detayları görüntüleyebilirsiniz.`,
            actionUrl: `/parent/children/${student.id}`,
          },
        })
        notificationCount++
      }
    }
    console.log(`✅ Created ${notificationCount} Notifications`)
  } catch (error: any) {
    if (error.code === 'P2021' || error.message?.includes('does not exist')) {
      console.log('⚠️  Notification table does not exist. Skipping...')
    } else {
      throw error
    }
  }

  // Parent Consents (Veli onayları)
  console.log('✅ Creating Parent Consents...')
  let consentCount = 0
  try {
    for (const parent of parents.slice(0, 15)) {
      const parentStudents = await prisma.parentStudent.findMany({
      where: { parentId: parent.id },
      include: { student: true },
    })

    for (const ps of parentStudents) {
      await (prisma as any).parentConsent.create({
        data: {
          parentId: parent.id,
          studentId: ps.studentId,
          media: Math.random() > 0.2,
          aiProcessing: Math.random() > 0.1,
          reports: Math.random() > 0.15,
          consentedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        },
      })
      consentCount++
    }
    }
    console.log(`✅ Created ${consentCount} Parent Consents`)
  } catch (error: any) {
    if (error.code === 'P2021' || error.message?.includes('does not exist')) {
      console.log('⚠️  ParentConsent table does not exist. Skipping...')
    } else {
      throw error
    }
  }

  console.log('\n🎉 Seeding completed successfully!')
  console.log('\n📋 Summary:')
  console.log(`  - ${createdDomains.length} Development Domains`)
  console.log(`  - 1 Admin`)
  console.log(`  - ${teachers.length} Teachers`)
  console.log(`  - ${parents.length} Parents`)
  console.log(`  - ${classes.length} Classes`)
  console.log(`  - ${students.length} Students`)
  console.log(`  - ${activities.length} Activities`)
  console.log(`  - ${assessmentCount} Assessments`)
  console.log(`  - ${recommendationCount} Activity Recommendations`)
  console.log(`  - ${logCount} Daily Logs`)
  console.log(`  - ${moodCount} Mood Tracker entries`)
  console.log(`\n🧬 V2 Modules:`)
  console.log(`  - ${profileCount} Neuro DNA Profiles`)
  console.log(`  - ${emotionCount} Daily Emotion Snapshots`)
  console.log(`  - ${summaryCount} AI Child Summaries`)
  console.log(`  - ${alertCount} Neuro Alerts`)
  console.log(`  - ${quickAssessmentCount} Quick Assessments`)
  console.log(`  - ${trendCount} Development Trends`)
  console.log(`  - ${notificationCount} Notifications`)
  console.log(`  - ${consentCount} Parent Consents`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
