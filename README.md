Shuffling the table cells on the titanic
==============

<a href="https://rawgit.com/parham-fazel/table_modifier/master/exercise.html" target="_blank">Example page</a>


#Purpose:

The main aim of this exercise is to provide you with an opportunity to demonstrate how you would architect a solution to a typical iframe­based problem. It will be assessing:
* code quality and code style
* ability to research unforeseen problems
* attention to detail and justification of approach 
* basic styling

#Resources:

There is a supplied HTML file containing:
* a div with an id of main. This div is hidden initially, and should be made visible when the
user clicks on the OK button after selecting the table size.
* an iframe. This iframe will be the iframe that you write content into dynamically. It is
imperative that this is the iframe you modify ­­­ you cannot create your own.
* a span with an id of coords. This span is used to display the current coordinates of the
mouse within the iframe. See Stage 3.
* a div with an id of log. This is the area to append logging information.

#Problem Description:

1. Design a user interface which has a way for a user to choose the number of rows and columns in a table. The user interface will need an OK button which will be required for the next stage. Be as creative as you like, but two fields and a button are satisfactory for this stage.
2. When the user clicks on the OK button, show the (#main) div and write a table of the specified dimensions into the (iframe) provided already on the page. In addition, you will need to write some styles into this iframe for highlighting 'selected' cells (e.g. with a background colour). We do not want you to use external stylesheets for this.
3. Move the (#coords) span around to follow the mouse when WITHIN the iframe and display the current coordinates of the mouse WITHIN the iframe. The screenshot below will give some idea of what we mean. Note, this will need to work when the iframe is scrolled as well. As soon as the mouse moves outside of the iframe, the (#coords) span should be hidden again.
4. Provide a basic cell selection approach for the table. This will include:
  * A single left­click cancels the selection of any other cells, and toggles the selection of the cell at the mouse pointer.
  * A single right­click toggles the selection of the cell at the mouse pointer, and preserves selection of any other cells. Essentially, you are adding to the selection.
  * A double left­click cancels the selection of any other cells, and selects the entire row at the mouse pointer.
The selected status of the cell has nothing to do with the browser's selection, and is purely based on how you choose to tag a cell as 'selected', which will probably be a class. Selected cells need be distinct from non­selected cells visually.
In addition, you will need to disable the context menu on right­click within the iframe, but not within the outer page.
Note, this selection behaviour is not complete and there are edge cases ... just choose what you think feels intuitive and be prepared to justify it.
￼
5. Pressing the delete key should delete all cells that are considered 'selected'. This will create an uneven table, which is fine.
6. The logging area (#log) needs to be filled with logging information of the operations performed. The operations that need to be logged are:
  * Toggling selection of a cell. Specify the cell grid position e.g. (0, 1) for row 0, column 1
  * Clearing selection of all cells.
  * Selecting an entire row. Specify the index of the row selected
e.g. row 1
  * Deleting the selected cells.
