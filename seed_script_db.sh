# Allows us to execute the seed command a certain amont of time
previous_value=$(head -n 1 seed_script_variable.txt)

#Relates to the number of if statement into prisma/seed.ts
number_of_steps_to_create_a_full_db=3


die () {
    echo
    echo >&2 "$@" 
    echo
    exit 1
}

echo "********** Script started **********"

[ "$#" -eq 1 ] || die "1 argument required, $# provided"

current_value=0

case $1 in
  "reset")
  if [ $previous_value -eq $number_of_steps_to_create_a_full_db ]; then
    current_value=1
  else
    echo
    echo "The database is already empty"
    echo
    exit 1
  fi;;
  "seed")
  if [ $previous_value -eq $number_of_steps_to_create_a_full_db ]; then
    echo
    echo "The database is already seeded"
    echo
    exit 1
  fi
  current_value=$number_of_steps_to_create_a_full_db;;
esac

if [ $current_value -ne 0 ]; then 
  for ((i = 0; $i<$current_value; i++)); do
  npx prisma db seed
  done

  rm seed_script_variable.txt
  echo $current_value >> seed_script_variable.txt
  echo
  echo "********** Script finished **********"
else
  echo 
  echo "Available commands: seed | reset"
  echo
  echo "********** Script finished **********"
fi
