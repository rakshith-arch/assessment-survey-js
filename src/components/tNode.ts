// A binary tree node
export type TNode =
{

        data: number;
				left: TNode;
				right: TNode;

}

export function sortedArrayToBST(arr, start: number, end: number)
{
    /* Base Case */
    if (start > end)
    {
        return null;
    }
    /* Get the middle element and make it root */
    var mid = parseInt(((start + end) / 2)+"");
    const ntnode: TNode = {
			data:arr[mid],
			left: null,
			right: null
		}

    /* Recursively construct the left subtree and make it
     left child of root */
    ntnode.left = sortedArrayToBST(arr, start, mid - 1);
    /* Recursively construct the right subtree and make it
     right child of root */
    ntnode.right = sortedArrayToBST(arr, mid + 1, end);
    return ntnode;
}
