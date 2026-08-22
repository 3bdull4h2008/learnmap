import University from '../models/University.js';

function escapeRegex(str) {
  if (!str) return '';
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const getUniversities = async (req, res, next) => {
  try {
    const {
      location,
      field,
      minMark,
      maxMark,
      maxCost,
      type,
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    if (location && typeof location === 'string') {
      query['location.city'] = { $regex: escapeRegex(location), $options: 'i' };
    }

    if (type && ['public', 'private', 'special-law', 'colleges', 'hospital', 'international'].includes(type)) {
      query.type = type;
    }

    if (field && typeof field === 'string') {
      query['majors.field'] = field;
    }

    if (maxCost && !isNaN(Number(maxCost))) {
      query['majors.annualCost'] = { ...query['majors.annualCost'], $lte: Number(maxCost) };
    }

    if (maxMark && !isNaN(Number(maxMark))) {
      query['majors.minMark'] = { ...query['majors.minMark'], $lte: Number(maxMark) };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(200, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const universities = await University.find(query)
      .skip(skip)
      .limit(limitNum)
      .sort({ 'ranking.national': 1 });

    const total = await University.countDocuments(query);

    res.status(200).json({
      success: true,
      count: universities.length,
      total,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      },
      data: universities
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const getUniversity = async (req, res, next) => {
  try {
    const university = await University.findById(req.params.id);

    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University not found'
      });
    }

    res.status(200).json({
      success: true,
      data: university
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const getUniversityMatcher = async (req, res, next) => {
  try {
    const {
      interestField,
      majorName,
      tawjihiMark,
      location,
      budget,
      path
    } = req.body;

    if (!tawjihiMark || isNaN(Number(tawjihiMark))) {
      return res.status(400).json({
        success: false,
        message: 'المعدّل التوجيهي مطلوب ويجب أن يكون رقماً'
      });
    }

    const mark = Number(tawjihiMark);
    if (mark < 0 || mark > 100) {
      return res.status(400).json({
        success: false,
        message: 'المعدّل التوجيهي يجب أن يكون بين 0 و 100'
      });
    }

    const query = {
      'majors.minMark': { $lte: mark }
    };

    if (budget && !isNaN(Number(budget))) {
      query['majors.annualCost'] = { $lte: Number(budget) };
    }

    if (location && typeof location === 'string') {
      const escaped = escapeRegex(location.trim());
      query.$or = [
        { 'location.city': { $regex: escaped, $options: 'i' } },
        { 'location.region': { $regex: escaped, $options: 'i' } }
      ];
    }

    if (interestField && typeof interestField === 'string') {
      query['majors.field'] = interestField;
    }

    if (majorName && typeof majorName === 'string') {
      query['majors.name'] = majorName;
    }

    if (path === 'academic') {
      if (!interestField) {
        query['majors.field'] = { $in: ['health', 'engineering-tech', 'business', 'languages-humanities'] };
      }
    } else if (path === 'vocational') {
      if (!interestField) {
        query['majors.field'] = { $regex: /^voc-/ };
      }
    }

    const universities = await University.find(query);

    const recommendations = [];

    universities.forEach(university => {
      university.majors.forEach(major => {
        if (major.minMark <= mark &&
            (!budget || major.annualCost <= budget) &&
            (!interestField || major.field === interestField) &&
            (!majorName || major.name === majorName)) {

          let score = 0;

          const markDiff = mark - major.minMark;
          if (markDiff <= 5) score += 30;
          else if (markDiff <= 15) score += 20;
          else if (markDiff <= 30) score += 10;
          else score += 5;

          if (budget) {
            const budgetRatio = major.annualCost / budget;
            if (budgetRatio <= 0.5) score += 20;
            else if (budgetRatio <= 0.8) score += 15;
            else if (budgetRatio <= 1.0) score += 10;
          }

          if (location) {
            if (university.location.city === location) score += 25;
            else if (university.location.region === location) score += 15;
          }

          if (university.ranking.national) {
            if (university.ranking.national <= 5) score += 15;
            else if (university.ranking.national <= 15) score += 10;
            else score += 5;
          }

          recommendations.push({
            university: {
              id: university._id,
              name: university.name,
              nameEn: university.nameEn,
              type: university.type,
              location: university.location,
              ranking: university.ranking,
              imageUrl: university.imageUrl
            },
            major: {
              name: major.name,
              nameEn: major.nameEn,
              field: major.field,
              minMark: major.minMark,
              annualCost: major.annualCost,
              duration: major.duration,
              description: major.description,
              careerPaths: major.careerPaths
            },
            score,
            matchReason: generateMatchReason(score, major, university, location)
          });
        }
      });
    });

    recommendations.sort((a, b) => b.score - a.score);

    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations.slice(0, 10)
    });
  } catch (err) {
    console.error('Matcher error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

function generateMatchReason(score, major, university, userLocation) {
  const reasons = [];

  if (university.location.city === userLocation) {
    reasons.push(`في مدينتك (${university.location.city})`);
  } else if (university.location.region === userLocation) {
    reasons.push(`في منطقتك (${university.location.region})`);
  }

  if (university.type === 'public') {
    reasons.push('جامعة حكومية');
  }

  if (university.ranking.national && university.ranking.national <= 10) {
    reasons.push(`مصنفة ${university.ranking.national} وطنياً`);
  }

  return reasons.length > 0 ? reasons.join(' • ') : 'تطابق جيد مع معاييرك';
}

export const getFields = async (req, res, next) => {
  try {
    const universities = await University.find({}, { 'majors.field': 1 });
    const fields = [...new Set(universities.flatMap(u => u.majors.map(m => m.field)))];

    res.status(200).json({
      success: true,
      data: fields
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const getGroupedMajors = async (req, res, next) => {
  try {
    const universities = await University.find({}, {
      name: 1, nameEn: 1, type: 1, 'location.city': 1,
      'location.region': 1, majors: 1, ranking: 1
    });

    const fieldMap = {};
    universities.forEach(u => {
      (u.majors || []).forEach(m => {
        const f = m.field || 'other';
        if (!fieldMap[f]) fieldMap[f] = {};
        const key = m.name;
        if (!fieldMap[f][key]) {
          fieldMap[f][key] = {
            name: m.name,
            nameEn: m.nameEn,
            field: f,
            duration: m.duration,
            universities: [],
            minMarks: [],
            costs: []
          };
        }
        fieldMap[f][key].universities.push({
          id: u._id,
          name: u.name,
          nameEn: u.nameEn,
          type: u.type,
          city: u.location?.city,
          region: u.location?.region,
          ranking: u.ranking?.national
        });
        if (m.minMark) fieldMap[f][key].minMarks.push(m.minMark);
        if (m.annualCost) fieldMap[f][key].costs.push(m.annualCost);
      });
    });

    const result = {};
    Object.keys(fieldMap).forEach(f => {
      result[f] = Object.values(fieldMap[f]).map(m => ({
        ...m,
        minMarkMin: m.minMarks.length ? Math.min(...m.minMarks) : 0,
        minMarkMax: m.minMarks.length ? Math.max(...m.minMarks) : 0,
        costMin: m.costs.length ? Math.min(...m.costs) : 0,
        costMax: m.costs.length ? Math.max(...m.costs) : 0,
        universityCount: m.universities.length
      }));
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const getAllMajorsList = async (req, res, next) => {
  try {
    const universities = await University.find({}, {
      name: 1, nameEn: 1, type: 1, 'location.city': 1, majors: 1
    });

    const majorMap = {};
    universities.forEach(u => {
      (u.majors || []).forEach(m => {
        const key = `${m.field}|${m.name}`;
        if (!majorMap[key]) {
          majorMap[key] = {
            name: m.name,
            nameEn: m.nameEn,
            field: m.field,
            duration: m.duration,
            description: m.description,
            careerPaths: m.careerPaths,
            universities: [],
            minMarks: [],
            costs: []
          };
        }
        if (!majorMap[key].universities.find(uni => uni.id === u._id.toString())) {
          majorMap[key].universities.push({
            id: u._id,
            name: u.name,
            type: u.type,
            city: u.location?.city
          });
        }
        if (m.minMark) majorMap[key].minMarks.push(m.minMark);
        if (m.annualCost) majorMap[key].costs.push(m.annualCost);
      });
    });

    const result = Object.values(majorMap).map(m => ({
      ...m,
      minMarkMin: m.minMarks.length ? Math.min(...m.minMarks) : 0,
      minMarkMax: m.minMarks.length ? Math.max(...m.minMarks) : 0,
      costMin: m.costs.length ? Math.min(...m.costs) : 0,
      costMax: m.costs.length ? Math.max(...m.costs) : 0,
      universityCount: m.universities.length
    }));

    res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const getCities = async (req, res, next) => {
  try {
    const universities = await University.find({}, { 'location.city': 1 });
    const cities = [...new Set(universities.map(u => u.location.city))];

    res.status(200).json({
      success: true,
      data: cities
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
