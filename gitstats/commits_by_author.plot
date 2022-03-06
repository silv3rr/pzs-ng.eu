set terminal png transparent size 640,240
set size 1.0,1.0

set terminal png transparent size 640,480
set output 'commits_by_author.png'
set key left top
set yrange [0:]
set xdata time
set timefmt "%s"
set format x "%Y-%m-%d"
set grid y
set ylabel "Commits"
set xtics rotate
set bmargin 6
plot 'commits_by_author.dat' using 1:2 title "psxc" w lines, 'commits_by_author.dat' using 1:3 title "daxxar" w lines, 'commits_by_author.dat' using 1:4 title "js" w lines, 'commits_by_author.dat' using 1:5 title "iwdisb" w lines, 'commits_by_author.dat' using 1:6 title "neoxed" w lines, 'commits_by_author.dat' using 1:7 title "Sked" w lines, 'commits_by_author.dat' using 1:8 title "skeddie" w lines, 'commits_by_author.dat' using 1:9 title "meij" w lines, 'commits_by_author.dat' using 1:10 title "dakrer" w lines, 'commits_by_author.dat' using 1:11 title "juanker" w lines, 'commits_by_author.dat' using 1:12 title "avizion" w lines, 'commits_by_author.dat' using 1:13 title "Skeddie" w lines, 'commits_by_author.dat' using 1:14 title "themolest" w lines, 'commits_by_author.dat' using 1:15 title "iono" w lines, 'commits_by_author.dat' using 1:16 title "tittof" w lines, 'commits_by_author.dat' using 1:17 title "freezy3k" w lines, 'commits_by_author.dat' using 1:18 title "comp" w lines, 'commits_by_author.dat' using 1:19 title "h-0-s-h" w lines, 'commits_by_author.dat' using 1:20 title "slv" w lines, 'commits_by_author.dat' using 1:21 title "silv3rr" w lines
