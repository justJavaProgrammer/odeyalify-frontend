import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload-album',
  templateUrl: './upload-album.component.html',
  styleUrls: ['./upload-album.component.css']
})
export class UploadAlbumComponent implements OnInit {
  songs?: any | null;
  avatar: any | null;
  url = '';
  constructor() {
    console.log("upload")
  }

  ngOnInit(): void {
  }

  handleSongFilesInput(event: EventTarget | null) {
    let inputElement = <HTMLInputElement> event;
    this.songs = inputElement.files;
  }


  handleDescriptionFile(): void {

  }

  handleAlbumImageInput(target: EventTarget | null) {
    let avatarFile = <HTMLInputElement> target;
    this.avatar = avatarFile.files![0];
    let reader = new FileReader();
    reader.readAsDataURL(this.avatar);
    reader.onload = (event) => { // called once readAsDataURL is completed
      this.url = event.target?.result as string;
    }
  }
}
