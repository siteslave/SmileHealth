select '04915' as hospcode, o.vn, o.hn, o.vstdate, o.vsttime, s.bps, s.bpd, s.bw, s.height, s.cc
from ovst as o
left join opdscreen as s on s.vn=o.vn
inner join patient as p on p.hn=o.hn
inner join ovstdiag as od on od.vn=o.vn
where o.vn is not null
and (od.icd10 between 'E100' and 'E149') or (od.icd10 between 'I10' and 'I159')
and o.vstdate between '2014-05-01' and '2014-05-30' 
