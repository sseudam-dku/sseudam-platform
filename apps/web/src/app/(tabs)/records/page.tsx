import { MOCK_RECORDS } from "@/data/mock";

const page = () => {
  return (
    <div className="scrollbar-hide flex flex-1 flex-col overflow-y-auto bg-neutral-100">
      <div className="flex flex-col gap-4 p-4">
        <div className="rounded-16 bg-white p-4 shadow-sm">
          <p className="body-5 mb-1 tracking-widest text-neutral-400 uppercase">총 분리배출 활동</p>
          <p className="head-3 text-neutral-900">5회 완료 🌱</p>
          <p className="body-5 mt-1 text-neutral-500">누적 65 포인트 획득</p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="body-5 px-1 tracking-widest text-neutral-400 uppercase">상세 기록 목록</p>
          <div className="flex flex-col gap-2">
            {MOCK_RECORDS.map(rec => (
              <div
                key={rec.id}
                className="rounded-16 flex items-center justify-between border border-neutral-100 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="head-2 flex size-11 items-center justify-center rounded-full bg-green-50">
                    {rec.emoji}
                  </div>
                  <div>
                    <p className="body-3 text-neutral-900">{rec.name}</p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className="body-5 rounded-full bg-neutral-100 px-2 py-0.5 text-neutral-600">
                        {rec.category}
                      </span>
                      <span className="body-5 text-neutral-400">{rec.date}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="body-3 text-green-500">+{rec.points}P</span>
                  <p className="body-5 mt-0.5 text-neutral-400">인증 완료</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
