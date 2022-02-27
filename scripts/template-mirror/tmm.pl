#!/usr/bin/perl

# tmm.pl - template-mirror-mini ;)
# doesnt rly mirror anything, just creates quotes.html (and if you want, the other pages too)
# original code by the legendary daxxar ofc

my $quotes_only = 1;

my %vars = (
  #templatedir => 'templates',
  #quotes_file => 'quotes',
  #outputdir => 'pages'
  #templatedir => $ENV{'HOME'} . '/dev/pzs-ng-scripts/template-mirror/templates',
  #quotes_file => $ENV{'HOME'} . '/dev/pzs-ng.eu/quotes',
  #outputdir => $ENV{'HOME'} . '/dev/pzs-ng.eu'
  templatedir => 'scripts/template-mirror/templates',
  quotes_file => 'quotes',
  outputdir => '.'
);
my %templates;

my @quotes;
open(QUOTES, $vars{'quotes_file'});
push(@quotes, $_) while <QUOTES>;
close(QUOTES);

sub parse_template_line {
  shift;
  my $line = shift or die "Called parse_template_line with invalid parameters (missing third param (line))\n";
  $line =~ s/\%time_of_generation/scalar localtime/eg;
  if ($line =~ /\%quotes/) {
    my $quoteString = '';
    my $qnum = @quotes;
    for (reverse @quotes) {
      my $quote = $_;
      $quoteString .= 'Quote #<b>' . $qnum-- . "</b><br>\n";
      $quoteString .= "-------------<br>\n";
      $quote = ' &nbsp; ' . $quote;
      $quote =~ s/</&lt;/g; $quote =~ s/>/&gt;/g;
      $quote =~ s/\\n/<br>\n &nbsp; /g;
      $quoteString .= $quote . "<br><br>\n";;
    }
    $line =~ s/\%quotes/$quoteString/g;
  }
  return $line;
}

sub generate_page {
  my $page = shift or die "Called generate_page with invalid parameters (missing second param (page))\n";
  my @lines = @_;
  open(PAGE, '>', "$vars{outputdir}/$page")
    or warn("Could not open '$vars{outputdir}/$page' for page generation. (OUTPUT FILE)") and return 0;
  foreach my $line (@lines) {
    if ($line eq '') { $line = ' ' }
    print PAGE parse_template_line($page, $line) . "\n";
  }
  close(PAGE);
  1;
}

$vars{'outputdir'} =~ s/\/+$//g;
$vars{'templatedir'} =~ s/\/+$//g;
print " * Start.\n";
opendir(TEMPLATEDIR, $vars{'templatedir'});
while ((my $entry = readdir(TEMPLATEDIR))) {
  my $fentry = "$vars{templatedir}/$entry";
  if (! -f $fentry) { next; }
  if ($entry =~ /^\./) { next; }
  if ($fentry !~ /\.tpl$/) { next; }
  open(TEMPLATE, '<', "$vars{templatedir}/$entry");
  $entry =~ s/\.tpl$//;
  while (my $line = <TEMPLATE>) {
    $line =~ s/[\r\n]+$//g;
    push(@{$templates{$entry}}, $line);
  }
  close(TEMPLATE);
}
closedir(TEMPLATEDIR);

if ( $quotes_only == 1 ) {
  $page = "$vars{quotes_file}.html";
  if ($0 =~ /pre-commit/ || $ENV{'CI'}) {
    print "  - Checking quotes for changes.\n";
    $g = qx(git diff --name-status HEAD~1 -- $vars{'quotes_file'});
    if ( $g !~ /^M\s+${b}$/) {
    print "    - No changes, exiting...\n";
      exit 0;
    }
  }
  print "   - Generating quotes page only.\n";
  print "    - Generating $page.\n";
  generate_page($page, @{$templates{$page}});
  if ($0 =~ /pre-commit/ || $ENV{'CI'}) {
    print "    - Running git add.\n";
    system("git", "add", $page);
    if ($ENV{'CI'}) {
      system("git", "config", "--global", "user.name", "$ENV{'GIT_USER_NAME'}");
      system("git", "config", "--global", "user.email", "$ENV{'GIT_USER_EMAIL'}");
      print "    - Running git commit.\n";
      system("git", "commit", "-m", "quotes++", $page);
      print "    - Running git push.\n";
      system("git", "push");
    }
  }
} else {
  print "   - Generating pages.\n";
  foreach my $page (keys %templates) {
    print "    - Generating $page.\n";
    generate_page($page, @{$templates{$page}});
  }
}

print " + Done.\n";

0;
