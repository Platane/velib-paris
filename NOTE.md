
# TODO

Fix tube potential dead lock ->
  2 consumers Ca and Cb, one consume A, other consume B
   - Ca get B, try to consume and will reject asynchronously
   - Cb get A, try to consume and will reject asynchronously
   - Ca reject B, but as Cb is busy so it can not consume it, Ca get it again

   - problem is : no mater in what order the consumer are considered, there is always only one consumer non busy and it's not the right one
