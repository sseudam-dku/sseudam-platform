ALTER TABLE waste_guides
  ADD COLUMN IF NOT EXISTS schedule TEXT,
  ADD COLUMN IF NOT EXISTS no_collect_day TEXT,
  ADD COLUMN IF NOT EXISTS disposal_place TEXT,
  ADD COLUMN IF NOT EXISTS disposal_place_type TEXT,
  ADD COLUMN IF NOT EXISTS disposal_time_start TEXT,
  ADD COLUMN IF NOT EXISTS disposal_time_end TEXT,
  ADD COLUMN IF NOT EXISTS management_zone TEXT,
  ADD COLUMN IF NOT EXISTS general_waste_method TEXT,
  ADD COLUMN IF NOT EXISTS general_waste_schedule TEXT;

UPDATE waste_guides SET
  schedule = '화·목',
  no_collect_day = '일·공휴일',
  disposal_place = '아파트 분리수거함 / 주택 지정 장소',
  disposal_place_type = '공동주택·단독주택',
  disposal_time_start = '18:00',
  disposal_time_end = '22:00',
  general_waste_method = '규격봉투에 담아 지정 요일에 배출',
  general_waste_schedule = '월·수·금'
WHERE district = '중구' AND category_id IN ('plastic', 'paper', 'glass', 'can', 'styrofoam', 'clothes');

UPDATE waste_guides SET
  schedule = '매일',
  no_collect_day = '일·공휴일',
  disposal_place = '음식물 전용 수거함',
  disposal_place_type = '공동주택·단독주택',
  disposal_time_start = '18:00',
  disposal_time_end = '22:00',
  general_waste_method = '규격봉투에 담아 지정 요일에 배출',
  general_waste_schedule = '월·수·금'
WHERE district = '중구' AND category_id = 'food';

UPDATE waste_guides SET
  schedule = '수시',
  no_collect_day = NULL,
  disposal_place = '형광등 전용 수거함 / 주민센터',
  disposal_place_type = '지정 수거시설',
  disposal_time_start = NULL,
  disposal_time_end = NULL,
  general_waste_method = '규격봉투에 담아 지정 요일에 배출',
  general_waste_schedule = '월·수·금'
WHERE district = '중구' AND category_id = 'lamp';

UPDATE waste_guides SET
  schedule = '수시',
  no_collect_day = NULL,
  disposal_place = '건전지 전용 수거함 (마트·주민센터)',
  disposal_place_type = '지정 수거시설',
  disposal_time_start = NULL,
  disposal_time_end = NULL,
  general_waste_method = '규격봉투에 담아 지정 요일에 배출',
  general_waste_schedule = '월·수·금'
WHERE district = '중구' AND category_id = 'battery';
