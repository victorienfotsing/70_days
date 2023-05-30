import { db } from "../firebaseInit";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { addDoc } from "@firebase/firestore";
import dayjs from "dayjs";

export interface Contract {
  id?: string;
  name: string;
  start: string;
  user: string;
  days: string[];
  updated_at: string;
  created_at: string;
  archived: boolean;
}

interface AddContractParams {
  name: string;
  start: string;
  user: string;
}

interface UpdateContractParams {
  name?: string;
  start?: string;
  days?: string[];
}

const CONTRACT = "contracts";

const ContractService = {
  async getAll(user: string) {
    if (user) {
      const contractsSnapshot = await getDocs(
        query(collection(db, CONTRACT), where("user", "==", user))
      );
      return contractsSnapshot.docChanges().map(
        (doc) =>
          ({
            ...doc.doc.data(),
            id: doc.doc.id,
          } as Contract)
      );
    }
    return Promise.resolve([]);
  },

  async getById(id: string) {
    if (id) {
      const contractsSnapshot = await getDoc(doc(db, CONTRACT, id));
      return contractsSnapshot.data() as Contract;
    }
    return Promise.resolve(undefined);
  },

  create(contract: AddContractParams) {
    return addDoc(collection(db, CONTRACT), contract);
  },

  update(id: string, contact: UpdateContractParams) {
    return updateDoc(doc(db, CONTRACT, id), { ...contact });
  },

  delete(id: string) {
    return deleteDoc(doc(db, CONTRACT, id));
  },

  async addDays(id: string, days: string[]) {
    return setDoc(
      doc(db, CONTRACT, id),
      { days },
      {
        merge: true,
      }
    )
      .then((val) => console.log(val))
      .catch((err) => console.error(err));
  },
  getWorkedDays(parms: {days: string[], start: string}) {
    const days = parms.days;
    const start = parms.start;
    const tmpDate = dayjs(start).set("year", dayjs().year());
    const tmpStart = tmpDate.isAfter(dayjs())
        ? tmpDate.set("year", dayjs().year() - 1)
        : tmpDate;
    return days.filter((d) => dayjs(d).isAfter(tmpStart)).length;
  },

  getWorkedDaysInTheCurrentYear(days: Date[]) {
    return days.filter((d) => dayjs(d).year() === dayjs().year()).length;
  }
}

export default ContractService;
