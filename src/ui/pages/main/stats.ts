import { atom } from "jotai";
import { ExamListItem } from "src/types/exam-record.type";
import { PersonalInformation } from "src/types/personal-information.type";

type mainPageAtomType = {
  header: string | number;
  profile: PersonalInformation | undefined;
  exam: ExamListItem | undefined;
};

const mainPageAtom = atom<mainPageAtomType>({
  header: "مرحباً 👋،",
  profile: undefined,
  exam: undefined,
});

export default mainPageAtom;
