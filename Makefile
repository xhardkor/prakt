# List System

app_test:
	./application/Test.sh

app_start:
	./application/Start.sh


# Record Video;

record: rec_gen rec_start

rec_gen:
	./recording/GenMedia.sh

rec_start:
	./recording/Record.sh

rec_live:
	go -C ./recording/www build -o LiveApp .
	./recording/www/LiveApp
