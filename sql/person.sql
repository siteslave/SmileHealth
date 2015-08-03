select p.cid, p.patient_hn as hn, p.fname, p.lname, p.birthdate, p.sex, p.house_regist_type_id as typearea
from person as p
where p.patient_hn in ('0004537', '0004914', '0004883', '0004298', '0004673')
