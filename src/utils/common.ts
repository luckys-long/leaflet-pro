import type { PropType } from 'vue';


type Point = [number, number];

export const definePropType = <T>(val: any): PropType<T> => val;

/**
 * @description 计算两点之间距离
 * @param {Point[]} pointA point1
 * @param {Point[]} pointB point2
 * @return {number[]}
 */
export const calcTwoPointDistance = (pointA: Point, pointB: Point) => {
  const minusX = Math.abs(pointA[0] - pointB[0]);
  const minusY = Math.abs(pointA[1] - pointB[1]);

  return Math.sqrt(Math.pow(minusX, 2) + Math.pow(minusY, 2));
};