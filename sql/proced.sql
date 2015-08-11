select v.hn as HN, o.vn as SEQ, o.icd9 as PROCED, o.price as PRICE
from doctor_operation as o
inner join ovst as v on v.vn=o.vn
where o.vn in ('580115104052', '580126095644')
