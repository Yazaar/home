document.execCommand('defaultParagraphSeparator', false, 'div');

var app = new Vue({
    el: '#app',
    data: {
        remsize: parseFloat(getComputedStyle(document.documentElement).fontSize),
        showNotes: true,
        notes: JSON.parse(window.localStorage.getItem('notes')) || [],
        currentNoteIndex: null,
        currentNote: null,
        selectedNodeIndex: null,
        paperWidth: 0
    },
    methods: {
        copy: function(obj) {
            return JSON.parse(JSON.stringify(obj));
        },
        getTimeStr: function() {
            return new Date().toISOString().replace('T', ' ').split('.', 1)[0];
        },
        toggleView: function () {
            if (this.showNotes === true) {
                this.showNotes = false;
            } else {
                this.showNotes = true;
            }
            this.$nextTick(function(){
                var paper = document.querySelector('#content');
                if (paper === null) {
                    return;
                }
                this.paperWidth = paper.offsetWidth- (2 * this.remsize);
            });
        },
        newNote: function () {
            this.notes.unshift({
                title: 'New Note',
                content: [],
                lastEdited: this.getTimeStr()
            });
            this.currentNoteIndex = 0;
            this.currentNote = this.copy(this.notes[0]);
            this.selectedNodeIndex = null;
            this.saveNotes();
        },
        changeTextAlign: function (e) {
            if (this.selectedNodeIndex === null) {
                return;
            }
            if (this.currentNote.content[this.selectedNodeIndex].textAlign === undefined) {
                return;
            }
            var nodes = e.currentTarget.parentElement.children;
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i] === e.currentTarget) {
                    if (i === 0) {
                        this.notes[this.currentNoteIndex].content[this.selectedNodeIndex].textAlign = 'left';
                        this.currentNote.content[this.selectedNodeIndex].textAlign = 'left';
                        this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
                        this.saveNotes();
                        return;
                    } else if (i === 1) {
                        this.notes[this.currentNoteIndex].content[this.selectedNodeIndex].textAlign = 'center';
                        this.currentNote.content[this.selectedNodeIndex].textAlign = 'center';
                        this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
                        this.saveNotes();
                        return;
                    } else if (i === 2) {
                        this.notes[this.currentNoteIndex].content[this.selectedNodeIndex].textAlign = 'right';
                        this.currentNote.content[this.selectedNodeIndex].textAlign = 'right';
                        this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
                        this.saveNotes();
                        return;
                    }
                }
            }
        },
        displayNote: function (note, index) {
            this.currentNoteIndex = index;
            this.currentNote = this.copy(note);
            this.$nextTick(function(){
                var paper = document.querySelector('#content');
                if (paper === null) {
                    return;
                }
                this.paperWidth = paper.offsetWidth - (2 * this.remsize);
            });
            this.selectedNodeIndex = null;
        },
        saveNotes: function() {
            if (this.currentNoteIndex !== 0 && this.currentNoteIndex !== null) {
                this.notes.unshift(this.notes[this.currentNoteIndex]);
                this.notes.splice(this.currentNoteIndex+1, 1);
                this.currentNoteIndex = 0;
            }
            localStorage.setItem('notes', JSON.stringify(this.notes));
        },
        textChange: function (e) {
            this.notes[this.currentNoteIndex].content[this.selectedNodeIndex].data = e.currentTarget.innerHTML;
            this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
            this.saveNotes();
        },
        titleChange: function (e) {
            this.notes[this.currentNoteIndex].title = e.currentTarget.innerText;
            this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
            this.saveNotes();
        },
        selectNode: function(index) {
            this.selectedNodeIndex = index;
        },
        newUnorderedListElement: function(){
            this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
            this.notes[this.currentNoteIndex].content.push({
                type: 'unordered list',
                data: ['']
            });
            this.currentNote.content.push({
                type: 'unordered list',
                data: ['']
            });
            this.selectedNodeIndex = this.currentNote.content.length-1;
            this.saveNotes();
        },
        newOrderedListElement: function(){
            this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
            this.notes[this.currentNoteIndex].content.push({
                type: 'ordered list',
                data: ['']
            });
            this.currentNote.content.push({
                type: 'ordered list',
                data: ['']
            });
            this.selectedNodeIndex = this.currentNote.content.length-1;
            this.saveNotes();
        },
        newImageElement: function(){
            this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
            this.notes[this.currentNoteIndex].content.push({
                type: 'image',
                data: [],
                textAlign: 'left'
            });
            this.currentNote.content.push({
                type: 'image',
                data: [],
                textAlign: 'left'
            });
            this.selectedNodeIndex = this.currentNote.content.length-1;
            this.saveNotes();
        },
        newChecklistElement: function(){
            this.notes[this.currentNoteIndex].content.push({
                type: 'checklist',
                data: [{text: '', checked: 'unchecked'}]
            });
            this.currentNote.content.push({
                type: 'checklist',
                data: [{text: '', checked: 'unchecked'}]
            });
            this.saveNotes();
        },
        newTextElement: function(){
            this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
            this.notes[this.currentNoteIndex].content.push({
                type: 'text',
                data: '',
                textAlign: 'left'
            });
            this.currentNote.content.push({
                type: 'text',
                data: '',
                textAlign: 'left'
            });
            this.selectedNodeIndex = this.currentNote.content.length-1;
            this.saveNotes();
        },
        deleteBlock: function(){
            this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
            this.notes[this.currentNoteIndex].content.splice(this.selectedNodeIndex, 1);
            this.currentNote = this.copy(this.notes[this.currentNoteIndex]);
            this.selectedNodeIndex = null;
            this.saveNotes();
        },
        upBlock: function(){
            if (this.selectedNodeIndex === 0) {
                return;
            }
            var temp = this.copy(this.notes[this.currentNoteIndex].content[this.selectedNodeIndex]);
            temp.lastEdited = this.getTimeStr();
            this.notes[this.currentNoteIndex].content[this.selectedNodeIndex] = this.notes[this.currentNoteIndex].content[this.selectedNodeIndex-1];
            this.notes[this.currentNoteIndex].content[this.selectedNodeIndex-1] = temp;
            this.selectedNodeIndex--;
            this.currentNote = this.copy(this.notes[this.currentNoteIndex]);
            this.saveNotes();
        },
        downBlock: function(){
            if (this.selectedNodeIndex === this.notes[this.currentNoteIndex].content.length-1) {
                return;
            }
            var temp = this.copy(this.notes[this.currentNoteIndex].content[this.selectedNodeIndex]);
            temp.lastEdited = this.getTimeStr();
            this.notes[this.currentNoteIndex].content[this.selectedNodeIndex] = this.notes[this.currentNoteIndex].content[this.selectedNodeIndex+1];
            this.notes[this.currentNoteIndex].content[this.selectedNodeIndex+1] = temp;
            this.selectedNodeIndex++;
            this.currentNote = this.copy(this.notes[this.currentNoteIndex]);
            this.saveNotes();
        },
        deleteNote: function(){
            this.notes.splice(this.currentNoteIndex, 1);
            this.currentNoteIndex = null;
            this.currentNote = null;
            this.selectedNodeIndex = null;
            this.saveNotes();
        },
        copyNote: function(){
            var copyObject = this.copy(this.notes[this.currentNoteIndex]);
            copyObject.lastEdited = this.getTimeStr();
            this.notes.unshift(copyObject);
            this.currentNote = this.copy(copyObject);
            this.currentNoteIndex = 0;
        },
        addImage: function(){
            var addToNote = this.currentNoteIndex;
            var addToElement = this.selectedNodeIndex;

            var fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.addEventListener('input', function(){
                var image = new Image();
                image.addEventListener('load', function(){
                    var canvas = document.createElement('canvas');
                    var context = canvas.getContext('2d');
                    canvas.setAttribute('width', this.width);
                    canvas.setAttribute('height', this.height);
                    context.clearRect(0, 0, this.width, this.height);
                    context.drawImage(this, 0, 0, this.width, this.height);
                    var base64image = canvas.toDataURL();
                    app.notes[addToNote].lastEdited = app.getTimeStr();
                    app.notes[addToNote].content[addToElement].data.push({
                        src: base64image,
                        width: 0.1
                    });
                    app.saveNotes();
                    if (addToNote === app.currentNoteIndex) {
                        app.currentNote.content[addToElement].data.push({
                            src: base64image,
                            width: 0.1
                        });
                    }
                });
                image.src = URL.createObjectURL(this.files[0]);
            });
            fileInput.click();
        },
        zoomOutImage: function(index){
            var width = Math.floor((this.currentNote.content[this.selectedNodeIndex].data[index].width - 0.05)*100)/100;
            if (width > 0) {
                this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
                this.notes[this.currentNoteIndex].content[this.selectedNodeIndex].data[index].width = width;
                this.currentNote.content[this.selectedNodeIndex].data[index].width = width;
                this.saveNotes();
            }
        },
        zoomInImage: function(index){
            var width = Math.floor((this.currentNote.content[this.selectedNodeIndex].data[index].width + 0.05)*100)/100;
            if (width < 1) {
                this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
                this.notes[this.currentNoteIndex].content[this.selectedNodeIndex].data[index].width = width;
                this.currentNote.content[this.selectedNodeIndex].data[index].width = width;
                this.saveNotes();
            }
        },
        deleteImage: function(index){
            this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
            this.notes[this.currentNoteIndex].content[this.selectedNodeIndex].data.splice(index, 1);
            this.currentNote.content[this.selectedNodeIndex].data.splice(index, 1);
            this.saveNotes();
        },
        addListItem: function(){
            this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
            this.notes[this.currentNoteIndex].content[this.selectedNodeIndex].data.push('');
            this.currentNote.content[this.selectedNodeIndex].data.push('');
            this.saveNotes();
        },
        deleteListItem: function(){
            if (this.notes[this.currentNoteIndex].content[this.selectedNodeIndex].data.length < 2) {
                return;
            }
            this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
            this.notes[this.currentNoteIndex].content[this.selectedNodeIndex].data.pop();
            this.currentNote.content[this.selectedNodeIndex].data = this.copy(this.notes[this.currentNoteIndex].content[this.selectedNodeIndex].data);
            this.saveNotes();
        },
        saveListText: function(e, index){
            this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
            this.notes[this.currentNoteIndex].content[this.selectedNodeIndex].data[index] = e.currentTarget.innerHTML;
            this.saveNotes();
        },
        addChecklistItem: function(){
            this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
            this.notes[this.currentNoteIndex].content[this.selectedNodeIndex].data.push({
                text: '',
                checked: 'unchecked'
            });
            this.currentNote.content[this.selectedNodeIndex].data.push({
                text: '',
                checked: 'unchecked'
            });
            this.saveNotes();
        },
        checkItem: function(nodeIndex, checkIndex){
            if (this.notes[this.currentNoteIndex].content[nodeIndex].data[checkIndex].checked === 'unchecked') {
                this.notes[this.currentNoteIndex].content[nodeIndex].data[checkIndex].checked = 'checked';
            } else {
                this.notes[this.currentNoteIndex].content[nodeIndex].data[checkIndex].checked = 'unchecked';
            }
            this.currentNote.content[nodeIndex].data = this.copy(this.notes[this.currentNoteIndex].content[nodeIndex].data);
            this.saveNotes();
        },
        saveChecklistText: function(e, index){
            this.notes[this.currentNoteIndex].lastEdited = this.getTimeStr();
            this.notes[this.currentNoteIndex].content[this.selectedNodeIndex].data[index].text = e.currentTarget.innerHTML;
            this.saveNotes();
        },
        moveBack: function(){
            this.currentNoteIndex = null;
            this.currentNote = null;
        },
        onResize: function(){
            var paper = document.querySelector('#content');
            if (paper === null) {
                return;
            }
            this.paperWidth = paper.offsetWidth - (2 * this.remsize);
        }
    },
    mounted: function(){
        window.addEventListener('resize', this.onResize);
    }
});