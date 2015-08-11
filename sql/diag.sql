select od.hn as HN, od.vn AS SEQ, od.icd10 AS DIAG_CODE, od.diagtype AS DIAG_TYPE
from ovstdiag as od
where od.vn in ('550725103549', '551017135427', '580226132626')
