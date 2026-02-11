import { cloneDeep } from 'lodash-es'
export function isDev() {
  return import.meta.env.VITE_APP_MODE_ENV === 'dev'
}

/**
 * 基础树节点接口
 */
interface TreeNode {
  id?: string | number
  parentId?: string | number
  children?: TreeNode[]
  [key: string]: unknown
}

/**
 * 将扁平数组转换为树形结构
 * @param treeNodes - 要转换的节点数组
 * @param key - 节点唯一标识字段，默认为 'id'
 * @param parentKey - 父节点标识字段，默认为 'parentId'
 * @returns 转换后的树形结构数组
 * @example
 * const nodes = [
 *   { id: 1, parentId: 0, name: 'Node 1' },
 *   { id: 2, parentId: 1, name: 'Node 1.1' },
 * ];
 * const tree = makeTree(nodes);
 */
export function makeTree<T extends TreeNode>(
  treeNodes: T[],
  key = 'id',
  parentKey = 'parentId',
): T[] {
  const treeNodeList = cloneDeep(treeNodes)
  // 创建节点映射，用于快速查找节点
  const nodesMap = new Map<string | number, T>(
    treeNodeList.map((node) => [node[key] as string | number, node]),
  )

  // 创建虚拟根节点
  const virtualRoot = { children: [] as T[] }

  // 构建树形结构
  treeNodeList.forEach((node) => {
    const parentId = node[parentKey] as string | number
    const parentNode = nodesMap.get(parentId) || virtualRoot
    if (!parentNode.children) {
      parentNode.children = []
    }
    parentNode.children.push(node)
  })

  // 返回虚拟根节点的子节点数组
  return virtualRoot.children || []
}

// const arr = [
//   { code: '1', parentCode: null, name: '武汉' },
//   { code: '11', parentCode: '1', name: '汉阳区' },
//   { code: '12', parentCode: '1', name: '洪山区' },
//   { code: '13', parentCode: '1', name: '江夏区' },
//   { code: '2', parentCode: null, name: '深圳' },
//   { code: '21', parentCode: '2', name: '宝安区' },
//   { code: '22', parentCode: '2', name: '南山区' },
//   { code: '23', parentCode: '2', name: '光明区' },
// ]
// console.log(makeTree(arr, 'code', 'parentCode'))
// console.log(arr)

export function loadScript(url: string) {
  // 检查脚本是否已经加载
  const node = document.head.querySelector(`script[src="${url}"]`)
  if (node) {
    console.log(`脚本(${url})已加载`)
    return Promise.resolve(node)
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.onload = () => {
      console.log(`脚本(${url})加载完成`)
      resolve(script)
    }
    script.onerror = reject
    script.src = url
    document.head.appendChild(script)
  })
}

export function removeScript(url: string) {
  const node = document.head.querySelector(`script[src="${url}"]`)
  if (node) {
    document.head.removeChild(node)
  }
}
