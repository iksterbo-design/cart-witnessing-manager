export interface Contact {
  id: number;
  name: string;
  phone: string;
  stage: string;
  tags: string;
  lastContact: string;
  note: string;
}

export const Contact: Contact[] = [
  { id: 0, name: "Bro. Kalemba", phone: "+254 711 000001", stage: "FollowUp", tags: ['Prayer', 'Family'], lastContact: "2026-11-02", note: "Prayed with family." },
  { id: 1, name: "Sister Wanjiru", phone: "+254 722 000002", stage: "Contacted", tags: ['Work'], lastContact: "2026-10-28", note: "Shared verse." },
  { id: 2, name: "Deacon Omondi", phone: "+254 733 000003", stage: "New", tags: ['Neighbor'], lastContact: "2026-10-20", note: "Did not answer." },
  { id: 3, name: "Sister Atieno", phone: "+254 744 000004", stage: "Closed", tags: ['Family'], lastContact: "2026-10-15", note: "Family relocated." },
  { id: 4, name: "Bro. Adeyemi", phone: "+234 803 000005", stage: "FollowUp", tags: ['Church'], lastContact: "2026-11-05", note: "Requested study plan." },
  { id: 5, name: "Sister Noor", phone: "+971 50 000006", stage: "Contacted", tags: ['Traveller'], lastContact: "2026-10-22", note: "Introduced via cart." }
];
