set terminal png transparent size 640,240
set size 1.0,1.0

set terminal png transparent size 640,480
set output 'lines_of_code_by_author.png'
set key left top
set yrange [0:]
set xdata time
set timefmt "%s"
set format x "%Y-%m-%d"
set grid y
set ylabel "Lines"
set xtics rotate
set bmargin 6
plot 'lines_of_code_by_author.dat' using 1:2 title "psxc" w lines, 'lines_of_code_by_author.dat' using 1:3 title "daxxar" w lines, 'lines_of_code_by_author.dat' using 1:4 title "js" w lines, 'lines_of_code_by_author.dat' using 1:5 title "iwdisb" w lines, 'lines_of_code_by_author.dat' using 1:6 title "neoxed" w lines, 'lines_of_code_by_author.dat' using 1:7 title "Sked" w lines, 'lines_of_code_by_author.dat' using 1:8 title "skeddie" w lines, 'lines_of_code_by_author.dat' using 1:9 title "meij" w lines, 'lines_of_code_by_author.dat' using 1:10 title "dakrer" w lines, 'lines_of_code_by_author.dat' using 1:11 title "juanker" w lines, 'lines_of_code_by_author.dat' using 1:12 title "avizion" w lines, 'lines_of_code_by_author.dat' using 1:13 title "Skeddie" w lines, 'lines_of_code_by_author.dat' using 1:14 title "themolest" w lines, 'lines_of_code_by_author.dat' using 1:15 title "iono" w lines, 'lines_of_code_by_author.dat' using 1:16 title "tittof" w lines, 'lines_of_code_by_author.dat' using 1:17 title "freezy3k" w lines, 'lines_of_code_by_author.dat' using 1:18 title "comp" w lines, 'lines_of_code_by_author.dat' using 1:19 title "h-0-s-h" w lines, 'lines_of_code_by_author.dat' using 1:20 title "slv" w lines, 'lines_of_code_by_author.dat' using 1:21 title "silv3rr" w lines
