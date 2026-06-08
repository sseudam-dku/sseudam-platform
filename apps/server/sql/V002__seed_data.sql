INSERT INTO waste_categories (id, name, emoji, sort_order) VALUES
  ('plastic', '플라스틱', '🧴', 1),
  ('paper', '종이·박스', '📦', 2),
  ('glass', '유리', '🍶', 3),
  ('can', '캔·고철', '🥫', 4),
  ('food', '음식물', '🥦', 5),
  ('styrofoam', '스티로폼', '📫', 6),
  ('clothes', '의류', '👕', 7),
  ('lamp', '형광등', '💡', 8),
  ('battery', '건전지', '🔋', 9)
ON CONFLICT (id) DO NOTHING;

INSERT INTO waste_guides (category_id, district, method, caution) VALUES
  ('plastic', '중구', '내용물을 깨끗이 비우고 압착한 후 뚜껑을 제거하여 플라스틱 수거함에 배출하세요.', '이물질이 많이 묻은 경우 일반쓰레기로 배출하세요.'),
  ('paper', '중구', '테이프·스티커를 제거한 후 묶어서 배출하거나 종이 수거함에 넣으세요.', '음식물이 묻은 종이는 일반쓰레기로 배출하세요.'),
  ('glass', '중구', '내용물을 비우고 깨끗이 씻은 후 유리 수거함에 배출하세요.', '깨진 유리는 신문지에 싸서 일반쓰레기로 배출하세요.'),
  ('can', '중구', '내용물을 비우고 가볍게 씻은 후 캔 수거함에 배출하세요.', '부탄가스 등 압축가스 캔은 구멍을 뚫어 배출하세요.'),
  ('food', '중구', '물기를 최대한 제거하여 음식물 전용 봉투나 수거함에 배출하세요.', '뼈, 조개껍데기, 과일씨 등은 일반쓰레기로 배출하세요.'),
  ('styrofoam', '중구', '내용물을 비우고 이물질을 제거한 후 스티로폼 수거함에 배출하세요.', '색이 들어간 스티로폼은 일반쓰레기로 배출하세요.'),
  ('clothes', '중구', '헌옷 수거함이나 의류 기증 센터에 배출하세요.', '속옷, 양말 등 재사용이 어려운 의류는 일반쓰레기로 배출하세요.'),
  ('lamp', '중구', '형광등 전용 수거함 또는 주민센터에 배출하세요.', '깨진 형광등은 신문지에 감싸 형광등 수거함에 배출하세요.'),
  ('battery', '중구', '건전지 전용 수거함(마트, 주민센터 등)에 배출하세요.', '리튬·니카드 배터리는 별도 수거함에 배출하세요.')
ON CONFLICT (category_id, district) DO NOTHING;

INSERT INTO badges (id, name, emoji, image, description, reward_points, condition_type, condition_value) VALUES
  ('streak-3', '연속 3일', '🔥', '/assets/badge/3days-master-badge.svg', '서비스에 3일 연속 빠짐없이 쓰레기 촬영을 완료한 경우', 300, 'streak_days', 3),
  ('all-categories', '분리수거 마스터', '🏆', '/assets/badge/all-trash-master-badge.svg', '서비스에 등록된 모든 종류의 쓰레기를 최소 한 번씩 모두 사진 촬영을 완료한 경우', 500, 'all_categories', 9),
  ('vinyl-collector', '비닐 수집가', '🛍️', '/assets/badge/vinyl-master-badge.svg', '''비닐'' 항목으로 분류되는 쓰레기를 총 3번 이상 사진 촬영 완료한 경우', 100, 'category_count', 3),
  ('plastic-collector', '플라스틱 수집가', '🧴', '/assets/badge/plastic-master-badge.svg', '''플라스틱'' 항목으로 분류되는 쓰레기를 총 3번 이상 사진 촬영 완료한 경우', 100, 'category_count', 3),
  ('paper-collector', '종이 수집가', '📦', '/assets/badge/paper-master-badge.svg', '''종이'' 항목으로 분류되는 쓰레기를 총 3번 이상 사진 촬영 완료한 경우', 100, 'category_count', 3)
ON CONFLICT (id) DO NOTHING;
